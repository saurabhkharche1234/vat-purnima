import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HeaderComponent } from '../components/header.component';
import { FooterComponent } from '../components/footer.component';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, HeaderComponent, FooterComponent],
  template: `
    <app-header></app-header>
    <main class="page-shell">
      <div class="auth-card">
        <h1>Welcome back</h1>
        <p>Sign in to track your orders and save favorites.</p>
        <form (ngSubmit)="submit()">
          <input placeholder="Email" [(ngModel)]="email" name="email" required />
          <input placeholder="Password" type="password" [(ngModel)]="password" name="password" required />
          <button class="btn primary" type="submit">Log in</button>
        </form>
        <p class="muted">Need an account? <a routerLink="/register">Create one</a></p>
        <p class="muted">Admin? <a routerLink="/admin/login">Admin login</a></p>
      </div>
    </main>
    <app-footer></app-footer>
  `,
  styles: [
    `.page-shell { padding: 1.25rem; max-width:520px; margin:0 auto; }`,
    `.auth-card { padding:1.4rem; border:1px solid #ece6df; border-radius:1rem; background:white; }`,
    `form { display:flex; flex-direction:column; gap:0.75rem; margin-top:1rem; }`,
    `input { padding:0.8rem 0.9rem; border:1px solid #ddd; border-radius:0.7rem; }`,
    `.btn { padding:0.8rem 1.1rem; border-radius:999px; text-decoration:none; font-weight:700; border:none; cursor:pointer; display:inline-block; }`,
    `.btn.primary { background:#2f241d; color:white; }`,
    `.muted { color:#6b5a4f; }`
  ]
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  email = '';
  password = '';

  submit(): void {
    this.authService.login(this.email, this.password);
    this.router.navigate(['/account']);
  }
}
