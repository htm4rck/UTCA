import { Injectable, NotFoundException, OnModuleDestroy } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { chromium, Browser } from 'playwright';
import { Curso, Carrera } from '../../entities';

@Injectable()
export class ReportService implements OnModuleDestroy {
  private browserPromise: Promise<Browser>;

  constructor(
    @InjectRepository(Curso) private cursoRepo: Repository<Curso>,
    @InjectRepository(Carrera) private carreraRepo: Repository<Carrera>,
  ) {
    this.browserPromise = chromium.launch();
  }

  async onModuleDestroy() {
    const browser = await this.browserPromise;
    await browser.close();
  }

  private async htmlToPdf(html: string): Promise<Buffer> {
    const browser = await this.browserPromise;
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle' });
    const pdf = await page.pdf({ format: 'A4', margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' } });
    await page.close();
    return Buffer.from(pdf);
  }

  async generateSilabo(cursoId: number): Promise<{ buffer: Buffer; filename: string }> {
    const curso = await this.cursoRepo.findOne({
      where: { id: cursoId },
      relations: ['ciclo', 'ciclo.carrera', 'semanas', 'evaluaciones'],
    });
    if (!curso) throw new NotFoundException('Curso not found');

    const semanas = curso.semanas.sort((a, b) => a.number - b.number);
    const esc = (s: string | undefined) => (s || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
      body{font-family:Arial,sans-serif;font-size:11px;color:#222}
      h1{font-size:20px;margin:0 0 4px} h2{font-size:13px;color:#666;margin:0 0 10px}
      h3{font-size:14px;margin:16px 0 6px;border-bottom:1px solid #ccc;padding-bottom:3px}
      table{width:100%;border-collapse:collapse;margin-bottom:12px}
      th,td{border:1px solid #bbb;padding:4px 6px;text-align:left}
      th{background:#f0f0f0;font-weight:bold}
    </style></head><body>
      <h1>${esc(curso.name)}</h1>
      <h2>${esc(curso.ciclo.name)} — ${esc(curso.ciclo.carrera.name)}</h2>
      <p>Código: ${esc(curso.code)}</p>
      <h3>Descripción</h3><p>${esc(curso.description)}</p>
      <h3>Metodología</h3><p>${esc(curso.methodology)}</p>
      <h3>Evaluación</h3>
      <table><tr><th>Componente</th><th>Peso</th></tr>
        ${curso.evaluaciones.map(e => `<tr><td>${esc(e.component)}</td><td>${e.weight}%</td></tr>`).join('')}
      </table>
      <h3>Cronograma Semanal</h3>
      <table><tr><th>Sem</th><th>Título</th><th>Temas</th><th>Tipo</th></tr>
        ${semanas.map(s => `<tr><td>${s.number}</td><td>${esc(s.title)}</td><td>${esc(s.topics?.replace(/;/g, ', '))}</td><td>${esc(s.type)}</td></tr>`).join('')}
      </table>
      <h3>Bibliografía</h3><p>${esc(curso.bibliography?.replace(/;/g, '<br>'))}</p>
    </body></html>`;

    const filename = this.slugify(`${curso.code}_${curso.name}_silabo`) + '.pdf';
    return { buffer: await this.htmlToPdf(html), filename };
  }

  async generateMallaCurricular(): Promise<{ buffer: Buffer; filename: string }> {
    const carrera = await this.carreraRepo.findOne({
      where: { id: 1 },
      relations: ['ciclos', 'ciclos.cursos'],
    });
    if (!carrera) throw new NotFoundException('Carrera not found');

    const ciclos = carrera.ciclos.sort((a, b) => a.number - b.number);

    const esc = (s: string | undefined) => (s || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    const ciclosHtml = ciclos.map(ciclo => `
      <h3>Ciclo ${ciclo.number} — ${esc(ciclo.name)}</h3>
      <table><tr><th>#</th><th>Código</th><th>Curso</th></tr>
        ${ciclo.cursos.sort((a, b) => a.order - b.order).map(c => `<tr><td>${c.order}</td><td>${esc(c.code)}</td><td>${esc(c.name)}</td></tr>`).join('')}
      </table>`).join('');

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
      body{font-family:Arial,sans-serif;font-size:11px;color:#222}
      h1{font-size:22px;margin:0 0 4px} h2{font-size:13px;color:#666;margin:0 0 5px}
      h3{font-size:14px;margin:16px 0 6px;border-bottom:1px solid #ccc;padding-bottom:3px}
      table{width:100%;border-collapse:collapse;margin-bottom:12px}
      th,td{border:1px solid #bbb;padding:4px 6px;text-align:left}
      th{background:#f0f0f0;font-weight:bold}
    </style></head><body>
      <h1>${esc(carrera.name)}</h1>
      <h2>${esc(carrera.degree)}</h2>
      <p>${esc(carrera.faculty)}</p>
      ${ciclosHtml}
    </body></html>`;

    const filename = this.slugify(`${carrera.code}_${carrera.name}_malla`) + '.pdf';
    return { buffer: await this.htmlToPdf(html), filename };
  }

  private slugify(text: string): string {
    return text
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9]+/g, '_')
      .replace(/^_|_$/g, '');
  }
}
