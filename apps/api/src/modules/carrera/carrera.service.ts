import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Carrera } from '../../entities';

@Injectable()
export class CarreraService {
  constructor(@InjectRepository(Carrera) private repo: Repository<Carrera>) {}

  findAll() {
    return this.repo.find({ relations: ['ciclos', 'ciclos.cursos'] });
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id }, relations: ['ciclos', 'ciclos.cursos'] });
  }
}
