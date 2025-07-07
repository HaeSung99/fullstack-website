import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum ContactStatus {
  UNPROCESSED = '미처리',
  PROCESSING = '처리중',
  COMPLETED = '처리완료',
}

@Entity()
export class Contact {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  company: string;

  @Column({ default: 'company' })
  identity: string; // 회사/개인

  @Column({ nullable: true })
  position: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @Column({ default: 'business' })
  type: string; // 문의유형

  @Column({ type: 'varchar', length: 100 })
  message: string;

  @Column({ default: 'email' })
  contactMethod: string;

  @Column({
    type: 'enum',
    enum: ContactStatus,
    default: ContactStatus.UNPROCESSED,
  })
  status: ContactStatus;

  @Column({ type: 'text', nullable: true })
  memo: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
} 