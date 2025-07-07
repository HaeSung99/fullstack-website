import { Controller, Get, Inject, Param, Post, Body } from '@nestjs/common';
import { AdminService } from 'src/admin/admin.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Contact } from '../entities/contact.entity';
import { ClassEnrollment } from '../entities/class-enrollment.entity';

@ApiTags('User')
@Controller('user')
export class UserController {
    constructor(
    @Inject(AdminService) private readonly adminService: AdminService,
) {}

// 공지사항 목록 조회
@Get('notice')
@ApiOperation({ summary: '공지사항 목록 조회' })
async getNotice() {
    return this.adminService.getNotice();
}

@Get('notice/:id')
@ApiOperation({ summary: '공지사항 상세 조회' })
async getNoticeById(@Param('id') id: number) {
    return this.adminService.getNoticeById(id);
}

// 팀원 목록 조회
@Get('team')
@ApiOperation({ summary: '팀원 목록 조회' })
async getTeamList() {
    return this.adminService.getTeamList();
}

// 스포츠 클래스 목록 조회
@Get('sports-class')
@ApiOperation({ summary: '스포츠 클래스 목록 조회' })
async getSportsClassList() {
    return this.adminService.getSportsClassList();
}

@Get('sports-class/:id')
@ApiOperation({ summary: '스포츠 클래스 상세 조회' })
async getSportsClassById(@Param('id') id: number) {
    return this.adminService.getSportsClassById(id);
}

// 문의 등록
@Post('/contact')
@ApiOperation({ summary: '문의 등록' })
async postContact(@Body() body: Partial<Contact>) {
    return this.adminService.postContact(body);
}

// 클래스 수강 신청
@Post('/sports-class/enroll')
@ApiOperation({ summary: '클래스 수강 신청' })
async postClassEnrollment(@Body() body: Partial<ClassEnrollment>) {
    return this.adminService.postClassEnrollment(body);
}
}
