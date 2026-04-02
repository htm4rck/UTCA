import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Ciclo } from './ciclo.entity';
import { Semana } from './semana.entity';
import { Evaluacion } from './evaluacion.entity';

@Entity()
export class Curso {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  order: number;

  @Column({ unique: true })
  code: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  methodology: string;

  @Column({ type: 'text', nullable: true })
  bibliography: string;

  @ManyToOne(() => Ciclo, (c) => c.cursos)
  ciclo: Ciclo;

  @OneToMany(() => Semana, (s) => s.curso)
  semanas: Semana[];

  @OneToMany(() => Evaluacion, (e) => e.curso)
  evaluaciones: Evaluacion[];
}
