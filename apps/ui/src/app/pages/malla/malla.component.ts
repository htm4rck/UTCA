import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ApiService } from '../../services/api.service';
import { PdfDialogComponent } from '../../pdf-dialog.component';

@Component({
  selector: 'app-malla',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatChipsModule, MatIconModule, MatButtonModule, MatDialogModule],
  template: `
    <a mat-button routerLink="/carreras" class="back-btn"><mat-icon>arrow_back</mat-icon> Carreras</a>

    @if (carrera) {
      <div class="page-header">
        <div class="header-row">
          <div>
            <h1>{{ carrera.name }}</h1>
            <p class="degree">{{ carrera.degree }}</p>
          </div>
          <button mat-raised-button class="pdf-btn" (click)="openMallaPdf()">
            <mat-icon>picture_as_pdf</mat-icon> Malla PDF
          </button>
        </div>
      </div>

      @for (ciclo of ciclos; track ciclo.id) {
        <div class="ciclo-section">
          <div class="ciclo-header">
            <h2>Ciclo {{ ciclo.number }} — {{ ciclo.name }}</h2>
            <mat-chip-set><mat-chip class="layer-chip">{{ ciclo.layer }}</mat-chip></mat-chip-set>
          </div>
          <div class="curso-grid">
            @for (curso of ciclo.cursos; track curso.id) {
              <mat-card class="curso-card" [routerLink]="['/curso', curso.id]">
                <div class="curso-order">{{ curso.order }}</div>
                <mat-card-header>
                  <mat-card-title>{{ curso.name }}</mat-card-title>
                  <mat-card-subtitle>{{ curso.code }}</mat-card-subtitle>
                </mat-card-header>
                <mat-card-content>
                  <p class="curso-desc">{{ curso.description | slice:0:120 }}...</p>
                </mat-card-content>
              </mat-card>
            }
          </div>
        </div>
      }
    }
  `,
  styles: [`
    .back-btn { margin-bottom: 8px; color: #757fef; }
    .page-header { margin-bottom: 24px; }
    .header-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; }
    .page-header h1 { margin-bottom: 4px; }
    .degree { color: #5b5b98; font-size: 14px; }
    .pdf-btn {
      background: linear-gradient(135deg, #757fef, #00b69b) !important;
      color: #fff !important; font-weight: 600; white-space: nowrap;
    }
    .ciclo-section { margin-bottom: 32px; }
    .ciclo-header { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
    .ciclo-header h2 { margin: 0; }
    .layer-chip { background: rgba(117,127,239,.1) !important; color: #757fef !important; font-weight: 600; }
    .curso-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
    .curso-card {
      cursor: pointer; padding: 20px; position: relative; overflow: hidden;
      transition: transform .2s, box-shadow .2s;
    }
    .curso-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 30px rgba(117,127,239,.18) !important;
    }
    .curso-order {
      position: absolute; top: 12px; right: 16px;
      width: 28px; height: 28px; border-radius: 50%;
      background: linear-gradient(135deg, #757fef, #00b69b);
      color: #fff; display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 13px;
    }
    .curso-desc { font-size: 13px; color: #5b5b98; margin-top: 8px; }
  `],
})
export class MallaComponent implements OnInit {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  private dialog = inject(MatDialog);
  carrera: any;
  ciclos: any[] = [];
  private carreraId = 0;

  ngOnInit() {
    this.carreraId = +this.route.snapshot.params['carreraId'];
    this.api.getCarrera(this.carreraId).subscribe((c) => {
      this.carrera = c;
      this.ciclos = (c.ciclos || []).sort((a: any, b: any) => a.number - b.number);
    });
  }

  openMallaPdf() {
    this.dialog.open(PdfDialogComponent, {
      data: { url: 'http://localhost:3999/api/reports/malla', title: `Malla — ${this.carrera.name}` },
      width: '95vw', height: '95vh', panelClass: 'pdf-dialog',
    });
  }
}
