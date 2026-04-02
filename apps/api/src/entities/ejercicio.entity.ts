import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Semana } from './semana.entity';

@Entity()
export class Ejercicio {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  statement: string;

  @Column({ type: 'text', nullable: true })
  solution: string;

  @Column({ default: 'medium' })
  difficulty: string; // easy, medium, hard

  @ManyToOne(() => Semana, (s) => s.ejercicios)
  semana: Semana;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
