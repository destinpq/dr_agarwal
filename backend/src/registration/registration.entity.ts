import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('registrations')
export class Registration {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 100 })
  email: string;

  @Column({ length: 20 })
  phone: string;

  @Column()
  age: number;

  @Column({ length: 50 })
  interestArea: string;

  @Column('date', { array: true })
  preferredDates: string[];

  @Column({ length: 20 })
  preferredTiming: string;

  @Column({ type: 'text', nullable: true })
  expectations: string;

  @Column({ length: 50 })
  referralSource: string;

  @Column({ default: 'pending' })
  paymentStatus: string;

  @Column({ type: 'bytea', nullable: true })
  paymentScreenshot: Buffer;

  @Column({ default: false })
  emailSent: boolean;

  @Column({ default: false })
  confirmationEmailSent: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 