import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-malla',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatChipsModule, MatIconModule, MatButtonModule],
  template: `
    <h1>🎓 Malla Curricular</h1>
    <p>Economía, Ingeniería Financiera y Data Science</p>

    @for (ciclo of ciclos; track ciclo.id) {
      <h2 style="margin-top:24px">Ciclo {{ ciclo.number }} — {{ ciclo.name }}</h2>
      <mat-chip-set>
        <mat-chip>{{ ciclo.layer }}</mat-chip>
      </mat-chip-set>
      <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(280px,1fr)); gap:16px; margin-top:12px">
        @for (curso of ciclo.cursos; track curso.id) {
          <mat-card [routerLink]="['/curso', curso.id]" style="cursor:pointer">
            <mat-card-header>
              <mat-card-title>{{ curso.order }}. {{ curso.name }}</mat-card-title>
              <mat-card-subtitle>{{ curso.code }}</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <p style="font-size:13px; color:#666">{{ curso.description | slice:0:120 }}...</p>
            </mat-card-content>
          </mat-card>
        }
      </div>
    }
  `,
})
export class MallaComponent implements OnInit {
  private api = inject(ApiService);
  ciclos: any[] = [];

  ngOnInit() {
    this.api.getCarrera(1).subscribe((carrera) => {
      this.ciclos = carrera.ciclos.sort((a: any, b: any) => a.number - b.number);
    });
  }
}
