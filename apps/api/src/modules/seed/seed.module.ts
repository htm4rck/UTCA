import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { Carrera, Ciclo, Curso, Semana, Evaluacion } from '../../entities';

@Module({
  imports: [TypeOrmModule.forFeature([Carrera, Ciclo, Curso, Semana, Evaluacion])],
  providers: [SeedService],
})
export class SeedModule {}
