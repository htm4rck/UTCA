import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ejercicio, Semana } from '../../entities';

@Injectable()
export class EjercicioService {
  constructor(@InjectRepository(Ejercicio) private repo: Repository<Ejercicio>) {}

  findBySemana(semanaId: number) {
    return this.repo.find({ where: { semana: { id: semanaId } }, order: { createdAt: 'DESC' } });
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id }, relations: ['semana'] });
  }

  create(semanaId: number, data: Partial<Ejercicio>) {
    return this.repo.save(this.repo.create({ ...data, semana: { id: semanaId } as Semana }));
  }

  async update(id: number, data: Partial<Ejercicio>) {
    await this.repo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number) {
    const ej = await this.findOne(id);
    if (!ej) throw new NotFoundException();
    return this.repo.remove(ej);
  }
}
