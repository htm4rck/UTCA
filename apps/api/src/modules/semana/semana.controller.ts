import { Controller, Get, Param, Query } from '@nestjs/common';
import { SemanaService } from './semana.service';

@Controller('semanas')
export class SemanaController {
  constructor(private readonly service: SemanaService) {}

  @Get()
  findByCurso(@Query('cursoId') cursoId: number) { return this.service.findByCurso(cursoId); }

  @Get(':id')
  findOne(@Param('id') id: number) { return this.service.findOne(id); }
}
