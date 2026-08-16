import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Nota, Semana } from '../../entities';
import { CreateNotaDto } from './dto/create-nota.dto';
import { UpdateNotaDto } from './dto/update-nota.dto';

@Injectable()
export class NotaService {
  constructor(
    @InjectRepository(Nota) private repo: Repository<Nota>,
    @InjectRepository(Semana) private semanaRepo: Repository<Semana>,
  ) {}

  findBySemana(semanaId: number) {
    return this.repo.find({ where: { semana: { id: semanaId } }, order: { createdAt: 'DESC' } });
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id }, relations: ['semana'] });
  }

  async create(semanaId: number, data: CreateNotaDto) {
    const semana = await this.semanaRepo.findOne({ where: { id: semanaId } });
    if (!semana) {
      throw new NotFoundException(`Semana ${semanaId} no encontrada`);
    }

    return this.repo.save(this.repo.create({ ...data, semana }));
  }

  async update(id: number, data: UpdateNotaDto) {
    const nota = await this.findOne(id);
    if (!nota) {
      throw new NotFoundException(`Nota ${id} no encontrada`);
    }

    await this.repo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number) {
    const nota = await this.findOne(id);
    if (!nota) throw new NotFoundException(`Nota ${id} no encontrada`);
    return this.repo.remove(nota);
  }
}
