import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PdfDialogComponent } from './pdf-dialog.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, RouterLink, RouterLinkActive,
    MatToolbarModule, MatButtonModule, MatIconModule,
    MatListModule, MatSidenavModule, MatDialogModule,
  ],
  template: `
    <!-- SIDEBAR -->
    <aside class="sidebar" [class.collapsed]="collapsed()">
      <div class="sidebar-logo">
        <mat-icon class="logo-icon">account_balance</mat-icon>
        @if (!collapsed()) {
          <div class="logo-text">
            <span class="logo-title">UTCA</span>
            <span class="logo-sub">Plataforma Académica</span>
          </div>
        }
      </div>

      <button class="toggle-btn" (click)="collapsed.set(!collapsed())">
        <mat-icon>{{ collapsed() ? 'chevron_right' : 'chevron_left' }}</mat-icon>
      </button>

      <nav class="sidebar-nav">
        @if (!collapsed()) { <span class="nav-section">PRINCIPAL</span> }
        <a class="nav-item" routerLink="/carreras" routerLinkActive="active">
          <mat-icon>school</mat-icon>
          @if (!collapsed()) { <span>Carreras</span> }
        </a>

        @if (!collapsed()) { <span class="nav-section">REPORTES</span> }
        <a class="nav-item" (click)="openMallaPdf()">
          <mat-icon>picture_as_pdf</mat-icon>
          @if (!collapsed()) { <span>Malla PDF</span> }
        </a>
      </nav>

      <div class="sidebar-footer">
        @if (!collapsed()) {
          <div class="faculty-info">
            <small>Facultad de Ciencias Económicas</small>
            <small>y Analítica de Datos</small>
          </div>
        }
      </div>
    </aside>

    <!-- MAIN AREA -->
    <div class="main-area" [class.sidebar-collapsed]="collapsed()">
      <header class="top-header">
        <div class="header-left">
          <span class="university-name">Universidad Tecnológica de Ciencias Aplicadas</span>
        </div>
        <div class="header-right">
          <span class="faculty-badge">Economía Cuantitativa</span>
        </div>
      </header>

      <main class="content-area">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [`
    :host { display: flex; height: 100vh; overflow: hidden; }

    /* SIDEBAR */
    .sidebar {
      width: 260px; height: 100vh; position: fixed; left: 0; top: 0; z-index: 100;
      background: linear-gradient(180deg, rgba(255,255,255,.92), rgba(255,255,255,.85)),
                  url('/img/aside_background.png') center / cover no-repeat;
      border-radius: 0 12px 12px 0;
      box-shadow: 2px 0 20px rgba(117,127,239,.08);
      display: flex; flex-direction: column;
      transition: width .3s ease;
      overflow: hidden;
    }
    .sidebar.collapsed { width: 68px; }

    .sidebar-logo {
      display: flex; align-items: center; gap: 12px;
      padding: 20px 16px; min-height: 72px;
    }
    .logo-icon { font-size: 32px; width: 32px; height: 32px; color: #757fef; }
    .logo-text { display: flex; flex-direction: column; white-space: nowrap; }
    .logo-title { font-weight: 800; font-size: 20px; color: #260944; letter-spacing: 1px; }
    .logo-sub { font-size: 11px; color: #5b5b98; margin-top: -2px; }

    .toggle-btn {
      position: absolute; top: 24px; right: -14px;
      width: 28px; height: 28px; border-radius: 50%;
      background: #757fef; color: #fff; border: 2px solid #fff;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; z-index: 10; box-shadow: 0 2px 8px rgba(117,127,239,.3);
    }
    .toggle-btn mat-icon { font-size: 18px; width: 18px; height: 18px; }

    .sidebar-nav { flex: 1; padding: 8px 12px; overflow-y: auto; }
    .nav-section {
      display: block; font-size: 11px; font-weight: 700; color: #a6acbe;
      text-transform: uppercase; padding: 16px 8px 6px; letter-spacing: .5px;
      position: relative; padding-left: 20px;
    }
    .nav-section::before {
      content: ''; position: absolute; left: 0; top: 50%; transform: translateY(-50%);
      width: 12px; height: 1px; background: #a6acbe;
    }

    .nav-item {
      display: flex; align-items: center; gap: 12px;
      padding: 12px 14px; border-radius: 6px; cursor: pointer;
      color: #260944; font-weight: 600; font-size: 14px;
      transition: background .2s, color .2s; text-decoration: none;
      white-space: nowrap;
    }
    .nav-item:hover { background: #f5f5f9; }
    .nav-item.active { background: #757fef; color: #fff; }
    .nav-item.active mat-icon { color: #fff; }
    .nav-item mat-icon { color: #5b5b98; font-size: 20px; width: 20px; height: 20px; }

    .sidebar-footer {
      padding: 16px; border-top: 1px solid #eef0f7;
    }
    .faculty-info {
      display: flex; flex-direction: column;
      font-size: 11px; color: #5b5b98; line-height: 1.4;
    }

    /* MAIN AREA */
    .main-area {
      margin-left: 260px; flex: 1; display: flex; flex-direction: column;
      height: 100vh; transition: margin-left .3s ease; overflow: hidden;
    }
    .main-area.sidebar-collapsed { margin-left: 68px; }

    .top-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 0 32px; height: 60px; min-height: 60px;
      background: #fff;
      box-shadow: 0 2px 12px rgba(47,143,232,.05);
      border-bottom: 1px solid #eef0f7;
    }
    .university-name { font-weight: 700; font-size: 15px; color: #260944; }
    .faculty-badge {
      background: linear-gradient(135deg, #757fef, #00b69b);
      color: #fff; padding: 6px 16px; border-radius: 20px;
      font-size: 13px; font-weight: 600;
    }

    .content-area {
      flex: 1; padding: 28px 32px; overflow-y: auto;
      max-width: 1200px;
    }
  `],
})
export class AppComponent {
  private dialog = inject(MatDialog);
  collapsed = signal(false);

  openMallaPdf() {
    this.dialog.open(PdfDialogComponent, {
      data: { url: 'http://localhost:3999/api/reports/malla', title: 'Malla Curricular' },
      width: '95vw', height: '95vh', panelClass: 'pdf-dialog',
    });
  }
}
