import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderComponent } from '../components/header.component';
import { FooterComponent } from '../components/footer.component';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent],
  template: `
    <app-header></app-header>
    <main class="page-shell">
      <div class="auth-card">
        <h1>Admin access</h1>
        <p>Use an email containing “admin” to access the control center.</p>
        <form (ngSubmit)="submit()">
          <input placeholder="Email" [(ngModel)]="email" name="email" required />
          <input placeholder="Password" type="password" [(ngModel)]="password" name="password" required />
          <button class="btn primary" type="submit">Enter admin area</button>
        </form>
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
    `.btn.primary { background:#2f241d; color:white; }`
  ]
})
export class AdminLoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  email = '';
  password = '';

  submit(): void {
    this.authService.login(this.email, this.password);
    this.router.navigate(['/admin/dashboard']);
  }
}
