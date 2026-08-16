import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Nota, Semana } from '../../entities';
import { NotaController } from './nota.controller';
import { NotaService } from './nota.service';

@Module({
  imports: [TypeOrmModule.forFeature([Nota, Semana])],
  controllers: [NotaController],
  providers: [NotaService],
})
export class NotaModule {}
