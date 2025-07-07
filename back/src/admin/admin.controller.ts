import { Controller, Get, Post, Put, Body, UseInterceptors, UploadedFile, Param, Delete, Patch, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AdminService } from './admin.service';
import { GuardGuard } from 'src/guard/guard.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Contact } from '../entities/contact.entity';
import { EnrollmentStatus } from '../entities/class-enrollment.entity';

@ApiTags('Admin')
@UseGuards(GuardGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('notice')
  @ApiOperation({ summary: '공지사항 목록 조회' })
  getNotice() {
    return this.adminService.getNotice();
  }

  @Get('notice/:id')
  @ApiOperation({ summary: '공지사항 상세 조회' })
  getNoticeById(@Param('id') id: number) {
    return this.adminService.getNoticeById(id);
  }

  @Post('notice')
  @ApiOperation({ summary: '공지사항 추가' })
  postNotice(@Body() body: any) {
    return this.adminService.postNotice(body);
  }

  @Delete('notice/:id')
  @ApiOperation({ summary: '공지사항 삭제' })
  deleteNotice(@Param('id') id: number) {
    return this.adminService.deleteNotice(id);
  }

  @Put('notice/:id')
  @ApiOperation({ summary: '공지사항 수정' })
  updateNotice(@Param('id') id: number, @Body() body: any) {
    return this.adminService.updateNotice(id, body);
  }

  @Get('sports-class')
  @ApiOperation({ summary: '스포츠 클래스 목록 조회' })
  getSportsClassList() {
    return this.adminService.getSportsClassList();
  }

  @Get('sports-class/:id')
  @ApiOperation({ summary: '스포츠 클래스 상세 조회' })
  getSportsClassById(@Param('id') id: number) {
    return this.adminService.getSportsClassById(id);
  }

  @Post('sports-class')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  @ApiOperation({ summary: '스포츠 클래스 추가' })
  async createSportsClass(
    @Body() body: any,
    @UploadedFile() file: any,
  ) {
    const imageUrl = file ? `/uploads/${file.filename}` : null;
    return this.adminService.createSportsClass({ ...body, image: imageUrl });
  }

  @Delete('sports-class/:id')
  @ApiOperation({ summary: '스포츠 클래스 삭제' })
  async deleteSportsClass(@Param('id') id: number) {
    return this.adminService.deleteSportsClass(id);
  }

  @Put('sports-class/:id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  @ApiOperation({ summary: '스포츠 클래스 수정' })
  async updateSportsClass(
    @Param('id') id: number,
    @Body() body: any,
    @UploadedFile() file: any,
  ) {
    const imageUrl = file ? `/uploads/${file.filename}` : body.image;
    return this.adminService.updateSportsClass(id, { ...body, image: imageUrl });
  }

  @Get('sports-class/:id/enrollments')
  @ApiOperation({ summary: '클래스 수강 신청자 목록 조회' })
  getClassEnrollmentList(@Param('id') classId: number) {
    return this.adminService.getClassEnrollmentList(classId);
  }

  @Get('enrollments')
  @ApiOperation({ summary: '전체 수강 신청 목록 조회' })
  getAllEnrollments() {
    return this.adminService.getAllEnrollments();
  }

  @Patch('enrollments/:id')
  @ApiOperation({ summary: '수강 신청 상태 변경' })
  async updateEnrollmentStatus(@Param('id') id: number, @Body() body: { status: EnrollmentStatus }) {
    try {
      return await this.adminService.updateEnrollmentStatus(id, body.status);
    } catch (error) {
      if (error.message === '해당 신청자를 찾을 수 없습니다.') {
        throw new Error('NOT_FOUND');
      } else if (error.message === '유효하지 않은 상태값입니다.') {
        throw new Error('BAD_REQUEST');
      }
      throw error;
    }
  }

  @Delete('enrollments/:id')
  @ApiOperation({ summary: '수강 신청 삭제' })
  async deleteEnrollment(@Param('id') id: number) {
    return this.adminService.deleteEnrollment(id);
  }

  // 팀원 목록 조회
  @Get('team')
  @ApiOperation({ summary: '팀원 목록 조회' })
  async getTeamList() {
    return this.adminService.getTeamList();
  }

  // 팀원 추가
  @Post('team')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  @ApiOperation({ summary: '팀원 추가' })
  async addTeamMember(
    @Body() body: any,
    @UploadedFile() file: any,
  ) {
    const imageUrl = file ? `/uploads/${file.filename}` : body.image;
    return this.adminService.addTeamMember({ ...body, image: imageUrl });
  }

  // 팀원 삭제
  @Delete('team/:id')
  @ApiOperation({ summary: '팀원 삭제' })
  async deleteTeamMember(@Param('id') id: number) {
    return this.adminService.deleteTeamMember(id);
  }

  // 팀원 수정
  @Put('team/:id')
  @ApiOperation({ summary: '팀원 수정' })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async updateTeamMember(
    @Param('id') id: number,
    @Body() body: any,
    @UploadedFile() file: any,
  ) {
    const imageUrl = file ? `/uploads/${file.filename}` : body.image;
    return this.adminService.updateTeamMember(id, { ...body, image: imageUrl });
  }

  @Patch('team/reorder')
  @ApiOperation({ summary: '팀원 순서 변경' })
  async reorderTeam(@Body() orderList: { id: number; order: number; version: number }[]) {
    return this.adminService.reorderTeam(orderList);
  }

  // 문의 전체 조회
  @Get('contact')
  getContacts() {
    return this.adminService.getContacts();
  }

  // 문의 상태/메모 수정
  @Patch('contact/:id')
  updateContact(@Param('id') id: number, @Body() body: Partial<Contact>) {
    return this.adminService.updateContact(id, body);
  }
}
