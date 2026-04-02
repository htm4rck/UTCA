import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Nota, Semana } from '../../entities';

@Injectable()
export class NotaService {
  constructor(@InjectRepository(Nota) private repo: Repository<Nota>) {}

  findBySemana(semanaId: number) {
    return this.repo.find({ where: { semana: { id: semanaId } }, order: { createdAt: 'DESC' } });
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id }, relations: ['semana'] });
  }

  create(semanaId: number, data: Partial<Nota>) {
    return this.repo.save(this.repo.create({ ...data, semana: { id: semanaId } as Semana }));
  }

  async update(id: number, data: Partial<Nota>) {
    await this.repo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number) {
    const nota = await this.findOne(id);
    if (!nota) throw new NotFoundException();
    return this.repo.remove(nota);
  }
}
