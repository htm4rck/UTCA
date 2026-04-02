import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { EjercicioService } from './ejercicio.service';
import { CreateEjercicioDto } from './dto/create-ejercicio.dto';
import { UpdateEjercicioDto } from './dto/update-ejercicio.dto';

@Controller('ejercicios')
export class EjercicioController {
  constructor(private readonly service: EjercicioService) {}

  @Get()
  findBySemana(@Query('semanaId', ParseIntPipe) semanaId: number) {
    return this.service.findBySemana(semanaId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Query('semanaId', ParseIntPipe) semanaId: number, @Body() data: CreateEjercicioDto) {
    return this.service.create(semanaId, data);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateEjercicioDto) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
