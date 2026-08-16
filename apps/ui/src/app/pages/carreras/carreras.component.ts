import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-carreras',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatIconModule, MatChipsModule],
  template: `
    <div class="page-header">
      <h1>Oferta Académica</h1>
      <p>Facultad de Ciencias Económicas y Analítica de Datos</p>
    </div>

    <div class="carreras-grid">
      @for (c of carreras; track c.id) {
        <mat-card class="carrera-card" [routerLink]="['/carrera', c.id, 'malla']">
          <div class="card-accent" [style.background]="colors[c.id % colors.length]"></div>
          <mat-icon class="card-icon">{{ icons[c.id % icons.length] }}</mat-icon>
          <mat-card-header>
            <mat-card-title>{{ c.name }}</mat-card-title>
            <mat-card-subtitle>{{ c.code }}</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p class="degree">{{ c.degree }}</p>
            <p class="desc">{{ c.description }}</p>
            @if (c.ciclos?.length) {
              <mat-chip-set>
                <mat-chip class="info-chip">{{ c.ciclos.length }} ciclos</mat-chip>
              </mat-chip-set>
            } @else {
              <mat-chip-set>
                <mat-chip class="pending-chip">Próximamente</mat-chip>
              </mat-chip-set>
            }
          </mat-card-content>
        </mat-card>
      }
    </div>
  `,
  styles: [`
    .page-header { margin-bottom: 28px; }
    .page-header h1 { margin-bottom: 4px; }
    .page-header p { color: #5b5b98; }

    .carreras-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 24px;
    }

    .carrera-card {
      cursor: pointer; padding: 28px; position: relative; overflow: hidden;
      transition: transform .25s, box-shadow .25s;
    }
    .carrera-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 36px rgba(117,127,239,.18) !important;
    }

    .card-accent {
      position: absolute; top: 0; left: 0; right: 0; height: 4px;
    }

    .card-icon {
      font-size: 40px; width: 40px; height: 40px;
      color: #757fef; margin-bottom: 12px;
    }

    .degree { font-size: 13px; color: #757fef; font-weight: 600; margin-bottom: 8px; }
    .desc { font-size: 13px; color: #5b5b98; }

    .info-chip {
      background: rgba(0,182,155,.1) !important; color: #00b69b !important;
      font-weight: 600;
    }
    .pending-chip {
      background: rgba(238,54,140,.08) !important; color: #ee368c !important;
      font-weight: 600;
    }
  `],
})
export class CarrerasComponent implements OnInit {
  private api = inject(ApiService);
  carreras: any[] = [];

  colors = [
    'linear-gradient(90deg, #757fef, #00b69b)',
    'linear-gradient(90deg, #00b69b, #02a0fc)',
    'linear-gradient(90deg, #ee368c, #757fef)',
  ];
  icons = ['trending_up', 'code', 'psychology'];

  ngOnInit() {
    this.api.getCarreras().subscribe(c => this.carreras = c);
  }
}
