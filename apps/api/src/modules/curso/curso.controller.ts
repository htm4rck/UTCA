import { Controller, Get, Param, Query } from '@nestjs/common';
import { CursoService } from './curso.service';

@Controller('cursos')
export class CursoController {
  constructor(private readonly service: CursoService) {}

  @Get()
  findAll(@Query('cicloId') cicloId?: number) {
    return cicloId ? this.service.findByCiclo(cicloId) : this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) { return this.service.findOne(id); }
}
