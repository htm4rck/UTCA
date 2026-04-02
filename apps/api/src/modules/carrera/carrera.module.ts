import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Carrera } from '../../entities';
import { CarreraController } from './carrera.controller';
import { CarreraService } from './carrera.service';

@Module({
  imports: [TypeOrmModule.forFeature([Carrera])],
  controllers: [CarreraController],
  providers: [CarreraService],
})
export class CarreraModule {}
