import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('content')
export class Content {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'div_id', unique: true })
  divId: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column()
  type: string;

  @Column({ type: 'jsonb', nullable: true })
  meta: any;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
} 