import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../services/cart.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="topbar">
      <div class="brand-wrap">
        <a routerLink="/" class="brand">mruna designs</a>
        <nav class="nav-links">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">Home</a>
          <a routerLink="/category/dresses" routerLinkActive="active">Dresses</a>
          <a routerLink="/category/tshirts" routerLinkActive="active">T-shirts</a>
          <a routerLink="/category/pants" routerLinkActive="active">Pants</a>
        </nav>
      </div>
      <div class="actions">
        <a routerLink="/account" class="action-link" *ngIf="auth.isAuthenticated()">Account</a>
        <a routerLink="/login" class="action-link" *ngIf="!auth.isAuthenticated()">Login</a>
        <a routerLink="/cart" class="cart-pill">Cart ({{ count }})</a>
      </div>
    </header>
  `,
  styles: [
    `:host { display:block; }`,
    `.topbar { display:flex; justify-content:space-between; align-items:center; padding:1rem 1.25rem; border-bottom:1px solid #ece6df; background:#fffdf9; position:sticky; top:0; z-index:20; }`,
    `.brand-wrap { display:flex; align-items:center; gap:1.25rem; }`,
    `.brand { font-size:1.3rem; font-weight:700; text-transform:uppercase; letter-spacing:0.2em; color:#2f241d; text-decoration:none; }`,
    `.nav-links { display:flex; gap:1rem; }`,
    `.nav-links a, .action-link { color:#5f4f3d; text-decoration:none; font-weight:600; }`,
    `.nav-links a.active, .action-link:hover { color:#b86b3c; }`,
    `.actions { display:flex; gap:0.8rem; align-items:center; }`,
    `.cart-pill { background:#2f241d; color:white; text-decoration:none; padding:0.65rem 1rem; border-radius:999px; font-weight:700; }`,
    `@media (max-width: 760px) { .nav-links { display:none; } .topbar { flex-wrap:wrap; gap:0.75rem; } }`
  ]
})
export class HeaderComponent {
  readonly cart = inject(CartService);
  readonly auth = inject(AuthService);
  count = 0;

  constructor() {
    this.cart.items$.subscribe((items) => {
      this.count = items.reduce((sum, item) => sum + item.quantity, 0);
    });
  }
}
