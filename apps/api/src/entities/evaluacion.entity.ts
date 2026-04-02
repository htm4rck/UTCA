import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Curso } from './curso.entity';

@Entity()
export class Evaluacion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  component: string;

  @Column()
  weight: number;

  @ManyToOne(() => Curso, (c) => c.evaluaciones)
  curso: Curso;
}
