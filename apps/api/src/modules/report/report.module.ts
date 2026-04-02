import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Curso, Carrera } from '../../entities';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';

@Module({
  imports: [TypeOrmModule.forFeature([Curso, Carrera])],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
