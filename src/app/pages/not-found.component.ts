import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <main class="page-shell">
      <h1>404</h1>
      <p>The page you are looking for doesn’t exist.</p>
      <a routerLink="/" class="btn">Back home</a>
    </main>
  `,
  styles: [
    `.page-shell { padding: 2rem 1.25rem; max-width:720px; margin:0 auto; text-align:center; }`,
    `.btn { display:inline-block; margin-top:1rem; padding:0.8rem 1.1rem; border-radius:999px; background:#2f241d; color:white; text-decoration:none; font-weight:700; }`
  ]
})
export class NotFoundComponent {}
