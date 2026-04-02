import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Ciclo } from './ciclo.entity';

@Entity()
export class Carrera {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column()
  name: string;

  @Column()
  degree: string;

  @Column()
  faculty: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToMany(() => Ciclo, (c) => c.carrera)
  ciclos: Ciclo[];
}
