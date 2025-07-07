import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { SportsClass } from '../entities/sports-class.entity';
import { Notice } from '../entities/notice.entity';
import { Team } from '../entities/team.entity';
import { AuthModule } from 'src/auth/auth.module';
import { Contact } from '../entities/contact.entity';
import { ClassEnrollment } from 'src/entities/class-enrollment.entity';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([SportsClass, Notice, Team, Contact, ClassEnrollment])
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
