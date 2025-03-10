import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Url {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.urls, { onDelete: 'CASCADE' })
  user: User;

  @Column({ unique: true })
  short_code: string;

  @Column()
  long_url: string;

  @CreateDateColumn()
  created_at: Date;

  @Column({ default: 0 })
  clicks: number;
}
