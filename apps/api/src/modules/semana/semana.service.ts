import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Semana } from '../../entities';

@Injectable()
export class SemanaService {
  constructor(@InjectRepository(Semana) private repo: Repository<Semana>) {}

  findByCurso(cursoId: number) {
    return this.repo.find({ where: { curso: { id: cursoId } }, relations: ['notas', 'ejercicios'], order: { number: 'ASC' } });
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id }, relations: ['curso', 'notas', 'ejercicios'] });
  }
}
