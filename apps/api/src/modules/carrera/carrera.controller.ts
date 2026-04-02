import { Controller, Get, Param } from '@nestjs/common';
import { CarreraService } from './carrera.service';

@Controller('carreras')
export class CarreraController {
  constructor(private readonly service: CarreraService) {}

  @Get()
  findAll() { return this.service.findAll(); }

  @Get(':id')
  findOne(@Param('id') id: number) { return this.service.findOne(id); }
}
