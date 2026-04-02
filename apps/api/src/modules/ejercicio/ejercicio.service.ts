import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ejercicio, Semana } from '../../entities';
import { CreateEjercicioDto } from './dto/create-ejercicio.dto';
import { UpdateEjercicioDto } from './dto/update-ejercicio.dto';

@Injectable()
export class EjercicioService {
  constructor(
    @InjectRepository(Ejercicio) private repo: Repository<Ejercicio>,
    @InjectRepository(Semana) private semanaRepo: Repository<Semana>,
  ) {}

  findBySemana(semanaId: number) {
    return this.repo.find({ where: { semana: { id: semanaId } }, order: { createdAt: 'DESC' } });
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id }, relations: ['semana'] });
  }

  async create(semanaId: number, data: CreateEjercicioDto) {
    const semana = await this.semanaRepo.findOne({ where: { id: semanaId } });
    if (!semana) {
      throw new NotFoundException(`Semana ${semanaId} no encontrada`);
    }

    return this.repo.save(this.repo.create({ ...data, semana }));
  }

  async update(id: number, data: UpdateEjercicioDto) {
    const ejercicio = await this.findOne(id);
    if (!ejercicio) {
      throw new NotFoundException(`Ejercicio ${id} no encontrado`);
    }

    await this.repo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number) {
    const ejercicio = await this.findOne(id);
    if (!ejercicio) throw new NotFoundException(`Ejercicio ${id} no encontrado`);
    return this.repo.remove(ejercicio);
  }
}
