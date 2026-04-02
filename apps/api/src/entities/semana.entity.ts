import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Curso } from './curso.entity';
import { Nota } from './nota.entity';
import { Ejercicio } from './ejercicio.entity';

@Entity()
export class Semana {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  number: number;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  topics: string;

  @Column({ default: 'class' })
  type: string; // class, exam, review, project

  @ManyToOne(() => Curso, (c) => c.semanas)
  curso: Curso;

  @OneToMany(() => Nota, (n) => n.semana)
  notas: Nota[];

  @OneToMany(() => Ejercicio, (e) => e.semana)
  ejercicios: Ejercicio[];
}
