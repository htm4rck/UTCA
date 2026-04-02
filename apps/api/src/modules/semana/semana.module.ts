import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Semana } from '../../entities';
import { SemanaController } from './semana.controller';
import { SemanaService } from './semana.service';

@Module({
  imports: [TypeOrmModule.forFeature([Semana])],
  controllers: [SemanaController],
  providers: [SemanaService],
})
export class SemanaModule {}
