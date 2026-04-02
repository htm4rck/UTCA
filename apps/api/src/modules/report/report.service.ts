import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Curso, Carrera } from '../../entities';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const PdfPrinter = require('pdfmake');

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Curso) private cursoRepo: Repository<Curso>,
    @InjectRepository(Carrera) private carreraRepo: Repository<Carrera>,
  ) {}

  async generateSilabo(cursoId: number): Promise<Buffer> {
    const curso = await this.cursoRepo.findOne({
      where: { id: cursoId },
      relations: ['ciclo', 'ciclo.carrera', 'semanas', 'evaluaciones'],
    });
    if (!curso) throw new NotFoundException('Curso not found');

    const semanas = curso.semanas.sort((a, b) => a.number - b.number);

    const docDefinition = {
      content: [
        { text: curso.name, style: 'header' },
        { text: `${curso.ciclo.name} — ${curso.ciclo.carrera.name}`, style: 'subheader' },
        { text: `Código: ${curso.code}`, margin: [0, 5, 0, 10] },
        { text: 'Descripción', style: 'sectionHeader' },
        { text: curso.description || '', margin: [0, 0, 0, 10] },
        { text: 'Metodología', style: 'sectionHeader' },
        { text: curso.methodology || '', margin: [0, 0, 0, 10] },
        { text: 'Evaluación', style: 'sectionHeader' },
        {
          table: {
            headerRows: 1,
            widths: ['*', 'auto'],
            body: [
              ['Componente', 'Peso'],
              ...curso.evaluaciones.map((e) => [e.component, `${e.weight}%`]),
            ],
          },
          margin: [0, 0, 0, 10],
        },
        { text: 'Cronograma Semanal', style: 'sectionHeader' },
        {
          table: {
            headerRows: 1,
            widths: ['auto', '*', '*', 'auto'],
            body: [
              ['Sem', 'Título', 'Temas', 'Tipo'],
              ...semanas.map((s) => [
                s.number.toString(),
                s.title,
                s.topics?.replace(/;/g, '\n') || '',
                s.type,
              ]),
            ],
          },
          margin: [0, 0, 0, 10],
        },
        { text: 'Bibliografía', style: 'sectionHeader' },
        { text: curso.bibliography?.replace(/;/g, '\n') || '' },
      ],
      styles: {
        header: { fontSize: 18, bold: true, margin: [0, 0, 0, 5] },
        subheader: { fontSize: 12, color: '#666', margin: [0, 0, 0, 10] },
        sectionHeader: { fontSize: 14, bold: true, margin: [0, 10, 0, 5] },
      },
      defaultStyle: { fontSize: 10 },
    };

    return this.createPdf(docDefinition);
  }

  async generateMallaCurricular(): Promise<Buffer> {
    const carrera = await this.carreraRepo.findOne({
      where: { id: 1 },
      relations: ['ciclos', 'ciclos.cursos'],
    });
    if (!carrera) throw new NotFoundException('Carrera not found');

    const ciclos = carrera.ciclos.sort((a, b) => a.number - b.number);

    const docDefinition = {
      content: [
        { text: carrera.name, style: 'header' },
        { text: carrera.degree, style: 'subheader' },
        { text: carrera.faculty, margin: [0, 0, 0, 15] },
        ...ciclos.flatMap((ciclo) => [
          { text: `Ciclo ${ciclo.number} — ${ciclo.name}`, style: 'sectionHeader' },
          {
            table: {
              headerRows: 1,
              widths: ['auto', 'auto', '*'],
              body: [
                ['#', 'Código', 'Curso'],
                ...ciclo.cursos
                  .sort((a, b) => a.order - b.order)
                  .map((c) => [c.order.toString(), c.code, c.name]),
              ],
            },
            margin: [0, 0, 0, 10],
          },
        ]),
      ],
      styles: {
        header: { fontSize: 20, bold: true, margin: [0, 0, 0, 5] },
        subheader: { fontSize: 12, color: '#666', margin: [0, 0, 0, 5] },
        sectionHeader: { fontSize: 14, bold: true, margin: [0, 10, 0, 5] },
      },
      defaultStyle: { fontSize: 10 },
    };

    return this.createPdf(docDefinition);
  }

  private createPdf(docDefinition: any): Promise<Buffer> {
    return new Promise((resolve) => {
      const printer = new PdfPrinter({
        Roboto: {
          normal: Buffer.from(''),
          bold: Buffer.from(''),
          italics: Buffer.from(''),
          bolditalics: Buffer.from(''),
        },
      });
      const doc = printer.createPdfKitDocument(docDefinition);
      const chunks: Buffer[] = [];
      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.end();
    });
  }
}
