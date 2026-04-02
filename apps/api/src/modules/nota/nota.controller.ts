import { Controller, Get, Post, Put, Delete, Param, Query, Body } from '@nestjs/common';
import { NotaService } from './nota.service';
import { Nota } from '../../entities';

@Controller('notas')
export class NotaController {
  constructor(private readonly service: NotaService) {}

  @Get()
  findBySemana(@Query('semanaId') semanaId: number) { return this.service.findBySemana(semanaId); }

  @Get(':id')
  findOne(@Param('id') id: number) { return this.service.findOne(id); }

  @Post()
  create(@Query('semanaId') semanaId: number, @Body() data: Partial<Nota>) {
    return this.service.create(semanaId, data);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() data: Partial<Nota>) { return this.service.update(id, data); }

  @Delete(':id')
  remove(@Param('id') id: number) { return this.service.remove(id); }
}
