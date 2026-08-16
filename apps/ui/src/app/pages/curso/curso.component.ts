import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ApiService } from '../../services/api.service';
import { PdfDialogComponent } from '../../pdf-dialog.component';

@Component({
  selector: 'app-curso',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatTableModule, MatButtonModule, MatIconModule, MatChipsModule, MatDialogModule],
  template: `
    <a mat-button [routerLink]="['/carrera', curso?.ciclo?.carrera?.id || 1, 'malla']" class="back-btn"><mat-icon>arrow_back</mat-icon> Malla</a>

    @if (curso) {
      <div class="curso-header">
        <h1>{{ curso.name }}</h1>
        <p>{{ curso.ciclo?.name }} — {{ curso.code }}</p>
      </div>

      <div class="actions">
        <button mat-raised-button class="pdf-btn" (click)="openSilaboPdf()">
          <mat-icon>picture_as_pdf</mat-icon> Ver Sílabo PDF
        </button>
      </div>

      <mat-card class="section-card">
        <mat-card-header><mat-card-title>Descripción</mat-card-title></mat-card-header>
        <mat-card-content><p>{{ curso.description }}</p></mat-card-content>
      </mat-card>

      <mat-card class="section-card">
        <mat-card-header><mat-card-title>Evaluación</mat-card-title></mat-card-header>
        <mat-card-content>
          <table mat-table [dataSource]="curso.evaluaciones" class="eval-table">
            <ng-container matColumnDef="component">
              <th mat-header-cell *matHeaderCellDef>Componente</th>
              <td mat-cell *matCellDef="let e">{{ e.component }}</td>
            </ng-container>
            <ng-container matColumnDef="weight">
              <th mat-header-cell *matHeaderCellDef>Peso</th>
              <td mat-cell *matCellDef="let e">
                <span class="weight-badge">{{ e.weight }}%</span>
              </td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="['component', 'weight']"></tr>
            <tr mat-row *matRowDef="let row; columns: ['component', 'weight']"></tr>
          </table>
        </mat-card-content>
      </mat-card>

      <h2 class="section-title">Semanas</h2>
      <div class="semana-grid">
        @for (s of semanas; track s.id) {
          <mat-card class="semana-card" [routerLink]="['/semana', s.id]">
            <div class="sem-number">{{ s.number }}</div>
            <mat-card-header>
              <mat-card-title class="sem-title">{{ s.title }}</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <mat-chip-set>
                <mat-chip [class]="'type-' + s.type">{{ s.type }}</mat-chip>
              </mat-chip-set>
            </mat-card-content>
          </mat-card>
        }
      </div>
    }
  `,
  styles: [`
    .back-btn { margin-bottom: 8px; color: #757fef; }
    .curso-header { margin-bottom: 16px; }
    .curso-header h1 { margin-bottom: 4px; }
    .curso-header p { color: #5b5b98; }
    .actions { margin-bottom: 20px; }
    .pdf-btn {
      background: linear-gradient(135deg, #757fef, #00b69b) !important;
      color: #fff !important; font-weight: 600;
    }
    .section-card { margin-bottom: 24px; padding: 20px; }
    .eval-table { width: 100%; }
    .weight-badge {
      background: rgba(0,182,155,.1); color: #00b69b;
      padding: 4px 14px; border-radius: 4px; font-weight: 600;
    }
    .section-title { margin-top: 8px; }
    .semana-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 12px; }
    .semana-card {
      cursor: pointer; padding: 16px; position: relative;
      transition: transform .2s, box-shadow .2s;
    }
    .semana-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(117,127,239,.15) !important;
    }
    .sem-number {
      position: absolute; top: 10px; right: 14px;
      width: 26px; height: 26px; border-radius: 50%;
      background: #757fef; color: #fff;
      display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 12px;
    }
    .sem-title { font-size: 14px; }
    .type-regular { background: rgba(117,127,239,.1) !important; color: #757fef !important; }
    .type-exam { background: rgba(238,54,140,.1) !important; color: #ee368c !important; }
    .type-project { background: rgba(0,182,155,.1) !important; color: #00b69b !important; }
  `],
})
export class CursoComponent implements OnInit {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  private dialog = inject(MatDialog);
  curso: any;
  semanas: any[] = [];
  private cursoId = 0;

  ngOnInit() {
    this.cursoId = +this.route.snapshot.params['id'];
    this.api.getCurso(this.cursoId).subscribe((c) => {
      this.curso = c;
      this.semanas = c.semanas?.sort((a: any, b: any) => a.number - b.number) || [];
    });
  }

  openSilaboPdf() {
    this.dialog.open(PdfDialogComponent, {
      data: { url: this.api.getSilaboPdf(this.cursoId), title: `Sílabo — ${this.curso.name}` },
      width: '95vw', height: '95vh', panelClass: 'pdf-dialog',
    });
  }
}
