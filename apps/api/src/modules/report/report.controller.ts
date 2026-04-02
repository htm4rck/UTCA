import { Controller, Get, Param, Res } from '@nestjs/common';
import type { Response } from 'express';
import { ReportService } from './report.service';

@Controller('reports')
export class ReportController {
  constructor(private readonly service: ReportService) {}

  @Get('silabo/:cursoId')
  async silabo(@Param('cursoId') cursoId: number, @Res() res: any) {
    const buffer = await this.service.generateSilabo(cursoId);
    res.set({ 'Content-Type': 'application/pdf', 'Content-Disposition': `inline; filename=silabo-${cursoId}.pdf` });
    res.send(buffer);
  }

  @Get('malla')
  async malla(@Res() res: any) {
    const buffer = await this.service.generateMallaCurricular();
    res.set({ 'Content-Type': 'application/pdf', 'Content-Disposition': 'inline; filename=malla-curricular.pdf' });
    res.send(buffer);
  }
}
