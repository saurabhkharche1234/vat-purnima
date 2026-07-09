import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../components/header.component';
import { FooterComponent } from '../components/footer.component';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent, FooterComponent],
  template: `
    <app-header></app-header>
    <main class="page-shell">
      <div class="section-title">
        <div>
          <p class="eyebrow">Admin</p>
          <h1>Dashboard</h1>
        </div>
      </div>
      <div class="stats">
        <div class="card"><h3>Revenue</h3><p>$24.2k</p></div>
        <div class="card"><h3>Orders</h3><p>128</p></div>
        <div class="card"><h3>Low stock</h3><p>3 SKUs</p></div>
      </div>
      <div class="grid">
        <section class="card">
          <h3>Products</h3>
          <ul>
            <li *ngFor="let product of products">{{ product.name }} · {{ product.category }}</li>
          </ul>
        </section>
        <section class="card">
          <h3>Quick actions</h3>
          <a routerLink="/admin/products" class="action-link">Manage products</a>
          <a routerLink="/admin/orders" class="action-link">Manage orders</a>
          <a routerLink="/admin/inventory" class="action-link">Adjust inventory</a>
        </section>
      </div>
    </main>
    <app-footer></app-footer>
  `,
  styles: [
    `.page-shell { padding: 1.25rem; max-width:1220px; margin:0 auto; }`,
    `.section-title { margin-bottom:1rem; }`,
    `.eyebrow { text-transform:uppercase; letter-spacing:0.2em; color:#b86b3c; font-weight:700; }`,
    `.stats { display:grid; grid-template-columns:repeat(3, minmax(0,1fr)); gap:1rem; margin-bottom:1rem; }`,
    `.grid { display:grid; grid-template-columns:repeat(2, minmax(0,1fr)); gap:1rem; }`,
    `.card { padding:1.2rem; border:1px solid #ece6df; border-radius:1rem; background:white; }`,
    `.action-link { display:block; margin-top:0.5rem; color:#b86b3c; font-weight:700; text-decoration:none; }`,
    `@media (max-width: 760px) { .stats, .grid { grid-template-columns:1fr; } }`
  ]
})
export class AdminDashboardComponent {
  private readonly productService = inject(ProductService);
  readonly products = this.productService.getProducts();
}
