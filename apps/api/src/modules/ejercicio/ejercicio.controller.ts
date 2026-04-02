import { Controller, Get, Post, Put, Delete, Param, Query, Body } from '@nestjs/common';
import { EjercicioService } from './ejercicio.service';
import { Ejercicio } from '../../entities';

@Controller('ejercicios')
export class EjercicioController {
  constructor(private readonly service: EjercicioService) {}

  @Get()
  findBySemana(@Query('semanaId') semanaId: number) { return this.service.findBySemana(semanaId); }

  @Get(':id')
  findOne(@Param('id') id: number) { return this.service.findOne(id); }

  @Post()
  create(@Query('semanaId') semanaId: number, @Body() data: Partial<Ejercicio>) {
    return this.service.create(semanaId, data);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() data: Partial<Ejercicio>) { return this.service.update(id, data); }

  @Delete(':id')
  remove(@Param('id') id: number) { return this.service.remove(id); }
}
