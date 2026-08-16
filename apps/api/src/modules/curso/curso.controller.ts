import { BadRequestException, Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { CursoService } from './curso.service';

@Controller('cursos')
export class CursoController {
  constructor(private readonly service: CursoService) {}

  @Get()
  findAll(@Query('cicloId') cicloId?: string) {
    if (!cicloId) {
      return this.service.findAll();
    }

    const cicloIdNumber = Number(cicloId);
    if (Number.isNaN(cicloIdNumber)) {
      throw new BadRequestException('cicloId debe ser numérico');
    }

    return this.service.findByCiclo(cicloIdNumber);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }
}
