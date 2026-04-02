import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'malla', pathMatch: 'full' },
  { path: 'malla', loadComponent: () => import('./pages/malla/malla.component').then(m => m.MallaComponent) },
  { path: 'curso/:id', loadComponent: () => import('./pages/curso/curso.component').then(m => m.CursoComponent) },
  { path: 'semana/:id', loadComponent: () => import('./pages/semana/semana.component').then(m => m.SemanaComponent) },
];
