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
    const csvCount = this.readCsv<any>('carreras.csv').length;
    const dbCount = await this.carreraRepo.count();
    if (dbCount >= csvCount) {
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
      const exists = await this.carreraRepo.findOne({ where: { id: +row.id } });
      if (!exists) {
        await this.carreraRepo.save(this.carreraRepo.create({
          id: +row.id, code: row.code, name: row.name,
          degree: row.degree, faculty: row.faculty, description: row.description,
        }));
      }
    }
    this.logger.log(`Seeded carreras (total: ${carreras.length})`);

    const ciclos = this.readCsv<any>('ciclos.csv');
    for (const row of ciclos) {
      const exists = await this.cicloRepo.findOne({ where: { id: +row.id } });
      if (!exists) {
        await this.cicloRepo.save(this.cicloRepo.create({
          id: +row.id, number: +row.number, name: row.name,
          layer: row.layer, focus: row.focus,
          carrera: { id: +row.carrera_id } as Carrera,
        }));
      }
    }
    this.logger.log(`Seeded ciclos (total: ${ciclos.length})`);

    const cursos = this.readCsv<any>('cursos.csv');
    for (const row of cursos) {
      const exists = await this.cursoRepo.findOne({ where: { id: +row.id } });
      if (!exists) {
        await this.cursoRepo.save(this.cursoRepo.create({
          id: +row.id, order: +row.order, code: row.code, name: row.name,
          description: row.description, methodology: row.methodology,
          bibliography: row.bibliography,
          ciclo: { id: +row.ciclo_id } as Ciclo,
        }));
      }
    }
    this.logger.log(`Seeded cursos (total: ${cursos.length})`);

    const semanas = this.readCsv<any>('semanas.csv');
    for (const row of semanas) {
      const exists = await this.semanaRepo.findOne({ where: { id: +row.id } });
      if (!exists) {
        await this.semanaRepo.save(this.semanaRepo.create({
          id: +row.id, number: +row.number, title: row.title,
          topics: row.topics, type: row.type,
          curso: { id: +row.curso_id } as Curso,
        }));
      }
    }
    this.logger.log(`Seeded semanas (total: ${semanas.length})`);

    const evaluaciones = this.readCsv<any>('evaluaciones.csv');
    for (const row of evaluaciones) {
      const exists = await this.evaluacionRepo.findOne({ where: { id: +row.id } });
      if (!exists) {
        await this.evaluacionRepo.save(this.evaluacionRepo.create({
          id: +row.id, component: row.component, weight: +row.weight,
          curso: { id: +row.curso_id } as Curso,
        }));
      }
    }
    this.logger.log(`Seeded evaluaciones (total: ${evaluaciones.length})`);

    this.logger.log('Database seeding complete!');
  }
}
