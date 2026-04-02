import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Curso } from '../../entities';

@Injectable()
export class CursoService {
  constructor(@InjectRepository(Curso) private repo: Repository<Curso>) {}

  findAll() {
    return this.repo.find({ relations: ['ciclo', 'evaluaciones'], order: { order: 'ASC' } });
  }

  findByCiclo(cicloId: number) {
    return this.repo.find({ where: { ciclo: { id: cicloId } }, relations: ['evaluaciones'], order: { order: 'ASC' } });
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id }, relations: ['ciclo', 'semanas', 'evaluaciones'] });
  }
}
