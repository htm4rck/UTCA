import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-pdf-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="pdf-header">
      <h3>{{ data.title }}</h3>
      <span style="flex:1"></span>
      <a mat-icon-button [href]="data.url" target="_blank" title="Abrir en nueva pestaña">
        <mat-icon>open_in_new</mat-icon>
      </a>
      <button mat-icon-button mat-dialog-close title="Cerrar">
        <mat-icon>close</mat-icon>
      </button>
    </div>
    <iframe [src]="safeUrl" class="pdf-frame"></iframe>
  `,
  styles: [`
    :host { display: flex; flex-direction: column; height: 100%; }
    .pdf-header {
      display: flex; align-items: center; padding: 12px 16px;
      background: linear-gradient(135deg, #757fef 0%, #00b69b 100%);
      color: #fff;
    }
    .pdf-header h3 { margin: 0; font-size: 16px; }
    .pdf-header a, .pdf-header button { color: #fff !important; }
    .pdf-frame { flex: 1; border: none; width: 100%; }
  `],
})
export class PdfDialogComponent {
  data = inject<{ url: string; title: string }>(MAT_DIALOG_DATA);
  private sanitizer = inject(DomSanitizer);
  safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.data.url);
}
