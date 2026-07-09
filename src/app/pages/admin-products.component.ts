import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../components/header.component';
import { FooterComponent } from '../components/footer.component';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent, FooterComponent],
  template: `
    <app-header></app-header>
    <main class="page-shell">
      <div class="section-title">
        <div>
          <p class="eyebrow">Admin</p>
          <h1>Products</h1>
        </div>
        <a routerLink="/admin/products/new" class="btn primary">Add product</a>
      </div>
      <div class="list-card">
        <div class="row" *ngFor="let product of products">
          <div>
            <h3>{{ product.name }}</h3>
            <p>{{ product.category }} · {{ '$' + product.price.toFixed(2) }}</p>
          </div>
          <div class="actions">
            <a [routerLink]="['/admin/products', product.id, 'edit']" class="link">Edit</a>
            <button class="link">Delete</button>
          </div>
        </div>
      </div>
    </main>
    <app-footer></app-footer>
  `,
  styles: [
    `.page-shell { padding: 1.25rem; max-width:1220px; margin:0 auto; }`,
    `.section-title { display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; }`,
    `.eyebrow { text-transform:uppercase; letter-spacing:0.2em; color:#b86b3c; font-weight:700; }`,
    `.list-card { padding:1rem; border:1px solid #ece6df; border-radius:1rem; background:white; }`,
    `.row { display:flex; justify-content:space-between; align-items:center; padding:0.8rem 0; border-bottom:1px solid #f0ece6; }`,
    `.actions { display:flex; gap:0.75rem; }`,
    `.link { color:#b86b3c; font-weight:700; text-decoration:none; background:none; border:none; cursor:pointer; }`,
    `.btn { padding:0.8rem 1.1rem; border-radius:999px; text-decoration:none; font-weight:700; border:none; cursor:pointer; display:inline-block; }`,
    `.btn.primary { background:#2f241d; color:white; }`
  ]
})
export class AdminProductsComponent {
  private readonly productService = inject(ProductService);
  readonly products = this.productService.getProducts();
}
