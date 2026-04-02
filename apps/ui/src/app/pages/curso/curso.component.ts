import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-curso',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatTableModule, MatButtonModule, MatIconModule, MatChipsModule],
  template: `
    <a mat-button routerLink="/malla"><mat-icon>arrow_back</mat-icon> Malla</a>

    @if (curso) {
      <h1>{{ curso.name }}</h1>
      <p>{{ curso.ciclo?.name }} — {{ curso.code }}</p>

      <div style="display:flex; gap:8px; margin-bottom:16px">
        <a mat-raised-button color="primary" [href]="silaboPdfUrl" target="_blank">
          <mat-icon>picture_as_pdf</mat-icon> Sílabo PDF
        </a>
      </div>

      <mat-card style="margin-bottom:24px">
        <mat-card-header><mat-card-title>Descripción</mat-card-title></mat-card-header>
        <mat-card-content><p>{{ curso.description }}</p></mat-card-content>
      </mat-card>

      <mat-card style="margin-bottom:24px">
        <mat-card-header><mat-card-title>Evaluación</mat-card-title></mat-card-header>
        <mat-card-content>
          <table mat-table [dataSource]="curso.evaluaciones" style="width:100%">
            <ng-container matColumnDef="component">
              <th mat-header-cell *matHeaderCellDef>Componente</th>
              <td mat-cell *matCellDef="let e">{{ e.component }}</td>
            </ng-container>
            <ng-container matColumnDef="weight">
              <th mat-header-cell *matHeaderCellDef>Peso</th>
              <td mat-cell *matCellDef="let e">{{ e.weight }}%</td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="['component', 'weight']"></tr>
            <tr mat-row *matRowDef="let row; columns: ['component', 'weight']"></tr>
          </table>
        </mat-card-content>
      </mat-card>

      <h2>Semanas</h2>
      <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(250px,1fr)); gap:12px">
        @for (s of semanas; track s.id) {
          <mat-card [routerLink]="['/semana', s.id]" style="cursor:pointer">
            <mat-card-header>
              <mat-card-title style="font-size:14px">Sem {{ s.number }} — {{ s.title }}</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <mat-chip-set>
                <mat-chip [class]="s.type">{{ s.type }}</mat-chip>
              </mat-chip-set>
            </mat-card-content>
          </mat-card>
        }
      </div>
    }
  `,
})
export class CursoComponent implements OnInit {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  curso: any;
  semanas: any[] = [];
  silaboPdfUrl = '';

  ngOnInit() {
    const id = +this.route.snapshot.params['id'];
    this.silaboPdfUrl = this.api.getSilaboPdf(id);
    this.api.getCurso(id).subscribe((c) => {
      this.curso = c;
      this.semanas = c.semanas?.sort((a: any, b: any) => a.number - b.number) || [];
    });
  }
}
