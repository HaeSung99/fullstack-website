import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum ClassStatus {
  RECRUITING = 'RECRUITING',      // 모집중
  FULL = 'FULL',                 // 정원마감
  SUSPENDED = 'SUSPENDED',       // 모집중지
  UPCOMING = 'UPCOMING'          // 개강예정
}

export enum ClassLevel {
  BEGINNER = 'BEGINNER',         // 초급
  INTERMEDIATE = 'INTERMEDIATE', // 중급
  ADVANCED = 'ADVANCED'          // 고급
}

export enum ClassType {
  REGULAR = 'REGULAR',           // 정기클래스
  PRIVATE = 'PRIVATE',           // 개인레슨
  GROUP = 'GROUP'                // 소그룹레슨
}

@Entity()
export class SportsClass {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  sport: string; // 종목 (축구, 농구, 테니스 등)

  @Column()
  instructor: string; // 강사명

  @Column()
  schedule: string; // 스케줄 (예: 매주 화/목 19:00-20:30)

  @Column()
  startDate: string; // 개강일

  @Column()
  endDate: string; // 종료일

  @Column()
  maxParticipants: number; // 최대 정원

  @Column({ default: 0 })
  currentParticipants: number; // 현재 참가자 수

  @Column('decimal', { precision: 10, scale: 0 })
  price: number; // 수강료

  @Column({
    type: 'enum',
    enum: ClassLevel,
    default: ClassLevel.BEGINNER
  })
  level: ClassLevel;

  @Column({
    type: 'enum',
    enum: ClassType,
    default: ClassType.REGULAR
  })
  type: ClassType;

  @Column('text')
  description: string; // 클래스 설명

  @Column({ nullable: true })
  image: string;

  @Column()
  location: string; // 수업 장소

  @Column()
  ageGroup: string; // 연령대 (예: 성인, 초등생, 중학생 등)

  @Column({
    type: 'enum',
    enum: ClassStatus,
    default: ClassStatus.RECRUITING
  })
  status: ClassStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
} 