import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Carrera } from './carrera.entity';
import { Curso } from './curso.entity';

@Entity()
export class Ciclo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  number: number;

  @Column()
  name: string;

  @Column()
  layer: string;

  @Column({ type: 'text', nullable: true })
  focus: string;

  @ManyToOne(() => Carrera, (c) => c.ciclos)
  carrera: Carrera;

  @OneToMany(() => Curso, (c) => c.ciclo)
  cursos: Curso[];
}
