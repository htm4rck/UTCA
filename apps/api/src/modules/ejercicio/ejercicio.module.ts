import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ejercicio, Semana } from '../../entities';
import { EjercicioController } from './ejercicio.controller';
import { EjercicioService } from './ejercicio.service';

@Module({
  imports: [TypeOrmModule.forFeature([Ejercicio, Semana])],
  controllers: [EjercicioController],
  providers: [EjercicioService],
})
export class EjercicioModule {}
