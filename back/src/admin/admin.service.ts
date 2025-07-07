import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SportsClass } from '../entities/sports-class.entity';
import { Notice } from '../entities/notice.entity';
import { Team } from '../entities/team.entity';
import { Contact } from '../entities/contact.entity';
import { ClassEnrollment, EnrollmentStatus } from 'src/entities/class-enrollment.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(SportsClass)
    private sportsClassRepository: Repository<SportsClass>,
    @InjectRepository(Notice)
    private noticeRepository: Repository<Notice>,
    @InjectRepository(Team)
    private teamRepository: Repository<Team>,
    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>,
    @InjectRepository(ClassEnrollment)
    private classEnrollmentRepository: Repository<ClassEnrollment>,
  ) {}

  // 스포츠 클래스 관련 메서드들
  async getSportsClassList() {
    return this.sportsClassRepository.find({
      order: {
        createdAt: 'DESC'
      }
    });
  }

  async getSportsClassById(id: number) {
    return this.sportsClassRepository.findOne({ where: { id } });
  }

  async createSportsClass(data: Partial<SportsClass>) {
    const sportsClass = this.sportsClassRepository.create(data);
    return this.sportsClassRepository.save(sportsClass);
  }

  async updateSportsClass(id: number, data: Partial<SportsClass>) {
    await this.sportsClassRepository.update(id, data);
    return this.sportsClassRepository.findOne({ where: { id } });
  }

  async deleteSportsClass(id: number) {
    await this.sportsClassRepository.delete(id);
    return { message: '스포츠 클래스가 삭제되었습니다.' };
  }

  // 공지사항 관련 메서드들
  async getNotice() {
    return this.noticeRepository.find({
      order: {
        createdAt: 'DESC'
      }
    });
  }

  async getNoticeById(id: number) {
    return this.noticeRepository.findOne({ where: { id } });
  }

  async postNotice(data: Partial<Notice>) {
    const notice = this.noticeRepository.create(data);
    return this.noticeRepository.save(notice);
  }

  async updateNotice(id: number, data: Partial<Notice>) {
    await this.noticeRepository.update(id, data);
    return this.noticeRepository.findOne({ where: { id } });
  }

  async deleteNotice(id: number) {
    await this.noticeRepository.delete(id);
    return { message: '공지사항이 삭제되었습니다.' };
  }

  // 팀원 관련 메서드들
  async getTeamList() {
    return this.teamRepository.find({ order: { order: 'ASC' } });
  }

  async addTeamMember(data: Partial<Team>) {
    const team = this.teamRepository.create(data);
    return this.teamRepository.save(team);
  }

  async deleteTeamMember(id: number) {
    await this.teamRepository.delete(id);
    return { message: '팀원이 삭제되었습니다.' };
  }

  async updateTeamMember(id: number, data: Partial<Team>) {
    await this.teamRepository.update(id, data);
    return this.teamRepository.findOne({ where: { id } });
  }

  async reorderTeam(orderList: { id: number; order: number; version: number }[]) {
    return await this.teamRepository.manager.transaction(async manager => {
      for (const { id, order, version } of orderList) {
        // 낙관적 락: version이 다르면 에러 발생
        await manager.update(Team, { id, version }, { order });
      }
    });
  }

  // 문의 관련 메서드들
  async getContacts() {
    return this.contactRepository.find({ order: { createdAt: 'DESC' } });
  }

  async postContact(data: Partial<Contact>) {
    const contact = this.contactRepository.create(data);
    return this.contactRepository.save(contact);
  }

  async updateContact(id: number, data: Partial<Contact>) {
    await this.contactRepository.update(id, data);
    return this.contactRepository.findOne({ where: { id } });
  }

  // 클래스 수강 신청 관련 메서드들
  async postClassEnrollment(data: Partial<ClassEnrollment>) {
    const enrollment = this.classEnrollmentRepository.create(data);
    return this.classEnrollmentRepository.save(enrollment);
  }

  async getClassEnrollmentList(classId: number) {
    return this.classEnrollmentRepository.find({
      where: { classId },
      order: { createdAt: 'DESC' }
    });
  }

  async updateEnrollmentStatus(id: number, status: EnrollmentStatus) {
    // 신청자 존재 여부 확인
    const enrollment = await this.classEnrollmentRepository.findOne({ where: { id } });
    if (!enrollment) {
      throw new Error('해당 신청자를 찾을 수 없습니다.');
    }

    // 유효한 상태값인지 확인
    if (!Object.values(EnrollmentStatus).includes(status)) {
      throw new Error('유효하지 않은 상태값입니다.');
    }
    
    const updateData: any = { status };
    
    // 합격 상태로 변경 시 승인일자 설정
    if (status === EnrollmentStatus.APPROVED) {
      updateData.approvalDate = new Date();
    }
    
    await this.classEnrollmentRepository.update(id, updateData);
    return this.classEnrollmentRepository.findOne({ where: { id } });
  }

  async getAllEnrollments() {
    return this.classEnrollmentRepository.find({ 
      order: { createdAt: 'DESC' } 
    });
  }

  async deleteEnrollment(id: number) {
    await this.classEnrollmentRepository.delete(id);
    return { message: '수강 신청이 삭제되었습니다.' };
  }
}