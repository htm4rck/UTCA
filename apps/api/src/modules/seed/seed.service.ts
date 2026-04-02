import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { parse } from 'csv-parse/sync';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Carrera, Ciclo, Curso, Semana, Evaluacion } from '../../entities';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(Carrera) private carreraRepo: Repository<Carrera>,
    @InjectRepository(Ciclo) private cicloRepo: Repository<Ciclo>,
    @InjectRepository(Curso) private cursoRepo: Repository<Curso>,
    @InjectRepository(Semana) private semanaRepo: Repository<Semana>,
    @InjectRepository(Evaluacion) private evaluacionRepo: Repository<Evaluacion>,
  ) {}

  async onModuleInit() {
    const count = await this.carreraRepo.count();
    if (count > 0) {
      this.logger.log('Database already seeded, skipping...');
      return;
    }
    await this.seed();
  }

  private readCsv<T>(filename: string): T[] {
    const csvPath = join(__dirname, '..', '..', '..', '..', '..', 'seed', 'csv', filename);
    const content = readFileSync(csvPath, 'utf-8');
    return parse(content, { columns: true, skip_empty_lines: true, trim: true });
  }

  async seed() {
    this.logger.log('Seeding database...');

    const carreras = this.readCsv<any>('carreras.csv');
    for (const row of carreras) {
      await this.carreraRepo.save(this.carreraRepo.create({
        id: +row.id, code: row.code, name: row.name,
        degree: row.degree, faculty: row.faculty, description: row.description,
      }));
    }
    this.logger.log(`Seeded ${carreras.length} carreras`);

    const ciclos = this.readCsv<any>('ciclos.csv');
    for (const row of ciclos) {
      await this.cicloRepo.save(this.cicloRepo.create({
        id: +row.id, number: +row.number, name: row.name,
        layer: row.layer, focus: row.focus,
        carrera: { id: +row.carrera_id } as Carrera,
      }));
    }
    this.logger.log(`Seeded ${ciclos.length} ciclos`);

    const cursos = this.readCsv<any>('cursos.csv');
    for (const row of cursos) {
      await this.cursoRepo.save(this.cursoRepo.create({
        id: +row.id, order: +row.order, code: row.code, name: row.name,
        description: row.description, methodology: row.methodology,
        bibliography: row.bibliography,
        ciclo: { id: +row.ciclo_id } as Ciclo,
      }));
    }
    this.logger.log(`Seeded ${cursos.length} cursos`);

    const semanas = this.readCsv<any>('semanas.csv');
    for (const row of semanas) {
      await this.semanaRepo.save(this.semanaRepo.create({
        id: +row.id, number: +row.number, title: row.title,
        topics: row.topics, type: row.type,
        curso: { id: +row.curso_id } as Curso,
      }));
    }
    this.logger.log(`Seeded ${semanas.length} semanas`);

    const evaluaciones = this.readCsv<any>('evaluaciones.csv');
    for (const row of evaluaciones) {
      await this.evaluacionRepo.save(this.evaluacionRepo.create({
        id: +row.id, component: row.component, weight: +row.weight,
        curso: { id: +row.curso_id } as Curso,
      }));
    }
    this.logger.log(`Seeded ${evaluaciones.length} evaluaciones`);

    this.logger.log('Database seeding complete!');
  }
}
