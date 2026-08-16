import { Controller, Get, Param, ParseIntPipe, Res } from '@nestjs/common';
import type { Response } from 'express';
import { ReportService } from './report.service';

@Controller('reports')
export class ReportController {
  constructor(private readonly service: ReportService) {}

  @Get('silabo/:cursoId')
  async silabo(@Param('cursoId', ParseIntPipe) cursoId: number, @Res() res: Response) {
    const { buffer, filename } = await this.service.generateSilabo(cursoId);
    res.set({ 'Content-Type': 'application/pdf', 'Content-Disposition': `inline; filename="${filename}"` });
    res.send(buffer);
  }

  @Get('malla')
  async malla(@Res() res: Response) {
    const { buffer, filename } = await this.service.generateMallaCurricular();
    res.set({ 'Content-Type': 'application/pdf', 'Content-Disposition': `inline; filename="${filename}"` });
    res.send(buffer);
  }
}
