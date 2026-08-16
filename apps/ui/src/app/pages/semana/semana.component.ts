import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-semana',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterLink,
    MatCardModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatExpansionModule,
    MatChipsModule, MatSelectModule,
  ],
  template: `
    @if (semana) {
      <a mat-button [routerLink]="['/curso', semana.curso?.id]" class="back-btn">
        <mat-icon>arrow_back</mat-icon> {{ semana.curso?.name }}
      </a>

      <div class="semana-header">
        <h1>Semana {{ semana.number }} — {{ semana.title }}</h1>
        <mat-chip-set><mat-chip class="type-chip">{{ semana.type }}</mat-chip></mat-chip-set>
      </div>

      <mat-card class="section-card">
        <mat-card-header><mat-card-title>Temas</mat-card-title></mat-card-header>
        <mat-card-content>
          <ul class="topic-list">
            @for (t of topics; track t) { <li>{{ t }}</li> }
          </ul>
        </mat-card-content>
      </mat-card>

      <!-- NOTAS -->
      <h2 class="section-title">📝 Notas</h2>
      <mat-accordion>
        @for (nota of notas; track nota.id) {
          <mat-expansion-panel class="item-panel">
            <mat-expansion-panel-header>{{ nota.title }}</mat-expansion-panel-header>
            <p style="white-space:pre-wrap">{{ nota.content }}</p>
            <button mat-button color="warn" (click)="deleteNota(nota.id)"><mat-icon>delete</mat-icon></button>
          </mat-expansion-panel>
        }
      </mat-accordion>
      <mat-card class="form-card">
        <mat-form-field style="width:100%">
          <mat-label>Título</mat-label>
          <input matInput [(ngModel)]="newNota.title">
        </mat-form-field>
        <mat-form-field style="width:100%">
          <mat-label>Contenido</mat-label>
          <textarea matInput rows="4" [(ngModel)]="newNota.content"></textarea>
        </mat-form-field>
        <button mat-raised-button class="add-btn" (click)="addNota()"><mat-icon>add</mat-icon> Agregar Nota</button>
      </mat-card>

      <!-- EJERCICIOS -->
      <h2 class="section-title">🧮 Ejercicios</h2>
      <mat-accordion>
        @for (ej of ejercicios; track ej.id) {
          <mat-expansion-panel class="item-panel">
            <mat-expansion-panel-header>
              <mat-panel-title>{{ ej.title }}</mat-panel-title>
              <mat-panel-description>
                <span class="diff-badge" [class]="'diff-' + ej.difficulty">{{ ej.difficulty }}</span>
              </mat-panel-description>
            </mat-expansion-panel-header>
            <h4>Enunciado</h4>
            <p style="white-space:pre-wrap">{{ ej.statement }}</p>
            @if (ej.solution) {
              <h4>Solución</h4>
              <p style="white-space:pre-wrap">{{ ej.solution }}</p>
            }
            <button mat-button color="warn" (click)="deleteEjercicio(ej.id)"><mat-icon>delete</mat-icon></button>
          </mat-expansion-panel>
        }
      </mat-accordion>
      <mat-card class="form-card">
        <mat-form-field style="width:100%">
          <mat-label>Título</mat-label>
          <input matInput [(ngModel)]="newEj.title">
        </mat-form-field>
        <mat-form-field style="width:100%">
          <mat-label>Enunciado</mat-label>
          <textarea matInput rows="3" [(ngModel)]="newEj.statement"></textarea>
        </mat-form-field>
        <mat-form-field style="width:100%">
          <mat-label>Solución</mat-label>
          <textarea matInput rows="3" [(ngModel)]="newEj.solution"></textarea>
        </mat-form-field>
        <mat-form-field>
          <mat-label>Dificultad</mat-label>
          <mat-select [(ngModel)]="newEj.difficulty">
            <mat-option value="easy">Fácil</mat-option>
            <mat-option value="medium">Medio</mat-option>
            <mat-option value="hard">Difícil</mat-option>
          </mat-select>
        </mat-form-field>
        <br>
        <button mat-raised-button class="add-btn" (click)="addEjercicio()"><mat-icon>add</mat-icon> Agregar Ejercicio</button>
      </mat-card>
    }
  `,
  styles: [`
    .back-btn { margin-bottom: 8px; color: #757fef; }
    .semana-header { margin-bottom: 16px; }
    .semana-header h1 { margin-bottom: 8px; }
    .type-chip { background: rgba(117,127,239,.1) !important; color: #757fef !important; font-weight: 600; }
    .section-card { margin-bottom: 24px; padding: 20px; }
    .section-title { margin-top: 24px; }
    .topic-list { padding-left: 20px; }
    .topic-list li { color: #5b5b98; margin-bottom: 4px; }
    .item-panel { margin-bottom: 8px; background: #f7faff !important; border-radius: 8px !important; }
    .form-card { margin-top: 12px; padding: 20px; margin-bottom: 24px; }
    .add-btn {
      background: linear-gradient(135deg, #757fef, #00b69b) !important;
      color: #fff !important; font-weight: 600;
    }
    .diff-badge { padding: 2px 10px; border-radius: 4px; font-size: 12px; font-weight: 600; }
    .diff-easy { background: rgba(0,182,155,.1); color: #00b69b; }
    .diff-medium { background: rgba(117,127,239,.1); color: #757fef; }
    .diff-hard { background: rgba(238,54,140,.1); color: #ee368c; }
  `],
})
export class SemanaComponent implements OnInit {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);

  semana: any;
  topics: string[] = [];
  notas: any[] = [];
  ejercicios: any[] = [];
  newNota = { title: '', content: '' };
  newEj = { title: '', statement: '', solution: '', difficulty: 'medium' };

  ngOnInit() {
    this.load(+this.route.snapshot.params['id']);
  }

  load(id: number) {
    this.api.getSemana(id).subscribe((s) => {
      this.semana = s;
      this.topics = s.topics?.split(';').map((t: string) => t.trim()) || [];
      this.notas = s.notas || [];
      this.ejercicios = s.ejercicios || [];
    });
  }

  addNota() {
    if (!this.newNota.title) return;
    this.api.createNota(this.semana.id, this.newNota).subscribe(() => {
      this.newNota = { title: '', content: '' };
      this.load(this.semana.id);
    });
  }

  deleteNota(id: number) {
    this.api.deleteNota(id).subscribe(() => this.load(this.semana.id));
  }

  addEjercicio() {
    if (!this.newEj.title) return;
    this.api.createEjercicio(this.semana.id, this.newEj).subscribe(() => {
      this.newEj = { title: '', statement: '', solution: '', difficulty: 'medium' };
      this.load(this.semana.id);
    });
  }

  deleteEjercicio(id: number) {
    this.api.deleteEjercicio(id).subscribe(() => this.load(this.semana.id));
  }
}
