import { Entity, Column, PrimaryGeneratedColumn, VersionColumn } from 'typeorm';

@Entity()
export class Team {
  @PrimaryGeneratedColumn()
  id: number;

  @Column() 
  image: string;

  @Column()
  name: string;

  @Column()
  role: string;

  @Column('text')
  description: string;

  @Column({ default: 0 })
  order: number;

  @VersionColumn()
  version: number;
}
