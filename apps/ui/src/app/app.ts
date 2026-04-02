import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, MatToolbarModule, MatButtonModule, MatIconModule],
  template: `
    <mat-toolbar color="primary">
      <button mat-icon-button routerLink="/malla"><mat-icon>school</mat-icon></button>
      <span routerLink="/malla" style="cursor:pointer">Economía Cuantitativa</span>
      <span style="flex:1"></span>
      <a mat-button [href]="mallaPdfUrl" target="_blank"><mat-icon>picture_as_pdf</mat-icon> Malla PDF</a>
    </mat-toolbar>
    <main style="padding:24px; max-width:1200px; margin:0 auto">
      <router-outlet />
    </main>
  `,
})
export class AppComponent {
  mallaPdfUrl = 'http://localhost:3000/api/reports/malla';
}
