import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum EnrollmentStatus {
  PENDING = 'PENDING',           // 대기중
  APPROVED = 'APPROVED',         // 합격
  REJECTED = 'REJECTED'          // 불합격
}

export enum Gender {
  MALE = 'MALE',                 // 남성
  FEMALE = 'FEMALE'              // 여성
}

@Entity()
export class ClassEnrollment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    classId: number; // SportsClass의 ID

    @Column()
    name: string;

    @Column()
    phone: string;

    @Column()
    email: string;

    @Column()
    age: number; // 나이

    @Column({
        type: 'enum',
        enum: Gender
    })
    gender: Gender; // 성별

    @Column()
    experience: string; // 경험 수준 (초보자, 경험자 등)

    @Column('text', { nullable: true })
    message: string; // 특별 요청사항

    @Column('text', { nullable: true })
    medicalConditions: string; // 건강상 주의사항

    @Column({ nullable: true })
    emergencyContact: string; // 비상연락처

    @Column({ nullable: true })
    emergencyPhone: string; // 비상연락처 전화번호

    @Column({
        type: 'enum',
        enum: EnrollmentStatus,
        default: EnrollmentStatus.PENDING
    })
    status: EnrollmentStatus;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    enrollmentDate: Date; // 신청일

    @Column({ type: 'timestamp', nullable: true })
    approvalDate: Date; // 승인일

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
} 