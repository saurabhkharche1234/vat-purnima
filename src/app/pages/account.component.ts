import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../components/header.component';
import { FooterComponent } from '../components/footer.component';
import { AuthService } from '../services/auth.service';
import { ProductService } from '../services/product.service';
import { Category, Product, ProductVariant } from '../models/product';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, HeaderComponent, FooterComponent],
  template: `
    <app-header></app-header>
    <main class="page-shell" *ngIf="user; else guest">
      <div class="section-title">
        <div>
          <p class="eyebrow">Account</p>
          <h1>Welcome, {{ user.name }}</h1>
        </div>
        <button class="btn secondary" (click)="logout()">Log out</button>
      </div>

      <section class="hero-card" *ngIf="isAdmin">
        <div>
          <p class="eyebrow">Admin workspace</p>
          <h2>Manage products, pricing, images, and inventory from one place.</h2>
        </div>
      </section>

      <div class="grid" *ngIf="isAdmin">
        <section class="card">
          <h3>Add new product</h3>
          <form class="stack" (ngSubmit)="createProduct()">
            <input placeholder="Product name" [(ngModel)]="newProduct.name" name="name" required />
            <input placeholder="Slug" [(ngModel)]="newProduct.slug" name="slug" required />
            <input placeholder="Image URL" [(ngModel)]="newProductImage" name="image" />
            <input placeholder="Price" type="number" [(ngModel)]="newProduct.price" name="price" />
            <select [(ngModel)]="newProduct.category" name="category">
              <option value="dresses">Dresses</option>
              <option value="tshirts">T-shirts</option>
              <option value="pants">Pants</option>
            </select>
            <textarea placeholder="Description" [(ngModel)]="newProduct.description" name="description"></textarea>
            <button class="btn primary" type="submit">Add product</button>
          </form>
        </section>

        <section class="card">
          <h3>Inventory & pricing</h3>
          <div class="table-list" *ngFor="let product of products">
            <div class="table-row">
              <div>
                <strong>{{ product.name }}</strong>
                <p>{{ product.category }} · {{ '$' + product.price.toFixed(2) }}</p>
              </div>
              <div class="inline-actions">
                <input type="number" [ngModel]="product.price" (ngModelChange)="updatePrice(product.id, $event)" />
                <input type="text" [ngModel]="product.images[0]" (ngModelChange)="updateImage(product.id, $event)" />
              </div>
            </div>
            <div class="variant-list" *ngFor="let variant of product.variants">
              <label class="variant-row">
                <span>{{ variant.color }} / {{ variant.size }}</span>
                <input type="number" [ngModel]="variant.inventory" (ngModelChange)="updateInventory(product.id, variant.sku, $event)" />
              </label>
            </div>
          </div>
        </section>
      </div>

      <div class="grid" *ngIf="!isAdmin">
        <section class="card">
          <h3>Order history</h3>
          <div class="item" *ngFor="let order of user.orders">
            <strong>{{ order.id }}</strong>
            <span>{{ order.status }} · {{ '$' + order.total.toFixed(2) }}</span>
          </div>
        </section>
        <section class="card">
          <h3>Saved wishlist</h3>
          <p *ngIf="!user.wishlist.length">No saved items yet.</p>
          <ul>
            <li *ngFor="let item of user.wishlist">{{ item }}</li>
          </ul>
        </section>
      </div>
    </main>
    <ng-template #guest>
      <main class="page-shell">
        <h2>Please sign in to view your account.</h2>
        <a routerLink="/login" class="btn primary">Go to login</a>
      </main>
    </ng-template>
    <app-footer></app-footer>
  `,
  styles: [
    `.page-shell { padding: 1.25rem; max-width:1220px; margin:0 auto; }`,
    `.section-title { display:flex; justify-content:space-between; align-items:center; gap:1rem; margin-bottom:1rem; }`,
    `.eyebrow { text-transform:uppercase; letter-spacing:0.2em; color:#b86b3c; font-weight:700; }`,
    `.hero-card { padding:1.2rem; border:1px solid #ece6df; border-radius:1rem; background:linear-gradient(135deg,#f7e9dc,#fffdf9); margin-bottom:1rem; }`,
    `.grid { display:grid; grid-template-columns:repeat(2, minmax(0,1fr)); gap:1rem; }`,
    `.card { padding:1.2rem; border:1px solid #ece6df; border-radius:1rem; background:white; }`,
    `.stack { display:flex; flex-direction:column; gap:0.65rem; }`,
    `input, select, textarea { padding:0.8rem 0.9rem; border:1px solid #ddd; border-radius:0.7rem; }`,
    `.item { display:flex; justify-content:space-between; padding:0.45rem 0; border-bottom:1px solid #f0ece6; }`,
    `.table-list { display:flex; flex-direction:column; gap:0.8rem; margin-top:0.8rem; }`,
    `.table-row { display:flex; justify-content:space-between; gap:0.75rem; align-items:center; padding:0.7rem 0; border-bottom:1px solid #f0ece6; }`,
    `.inline-actions { display:flex; flex-direction:column; gap:0.5rem; min-width:180px; }`,
    `.variant-list { display:flex; flex-direction:column; gap:0.4rem; padding-left:0.5rem; }`,
    `.variant-row { display:flex; justify-content:space-between; align-items:center; color:#5f4f3d; }`,
    `.btn { padding:0.8rem 1.1rem; border-radius:999px; text-decoration:none; font-weight:700; border:none; cursor:pointer; display:inline-block; }`,
    `.btn.primary { background:#2f241d; color:white; }`,
    `.btn.secondary { background:#f4e8dc; color:#2f241d; }`,
    `@media (max-width: 760px) { .grid { grid-template-columns:1fr; } .section-title { flex-direction:column; align-items:flex-start; } .table-row { flex-direction:column; align-items:flex-start; } }`
  ]
})
export class AccountComponent {
  private readonly authService = inject(AuthService);
  private readonly productService = inject(ProductService);
  user = this.authService.getUser();
  isAdmin = this.authService.isAdmin();
  products = this.productService.getProducts();

  newProduct: Partial<Product> = {
    name: '',
    slug: '',
    category: 'dresses',
    description: '',
    price: 0,
    currency: 'USD',
    images: [],
    variants: [],
    attributes: {}
  };
  newProductImage = '';

  logout(): void {
    this.authService.logout();
    this.user = null;
  }

  createProduct(): void {
    if (!this.newProduct.name || !this.newProduct.slug) {
      return;
    }

    const product: Product = {
      id: `prod-${Date.now()}`,
      name: this.newProduct.name,
      slug: this.newProduct.slug,
      category: (this.newProduct.category as Category) ?? 'dresses',
      description: this.newProduct.description ?? '',
      price: Number(this.newProduct.price ?? 0),
      currency: 'USD',
      images: this.newProductImage ? [this.newProductImage] : [],
      variants: [{ sku: `${this.newProduct.slug}-default`, size: 'M', color: 'Default', price: Number(this.newProduct.price ?? 0), inventory: 0, images: this.newProductImage ? [this.newProductImage] : [] }],
      attributes: {},
      rating: 5,
      reviewsCount: 0
    };

    this.productService.createProduct(product);
    this.products = this.productService.getProducts();
    this.newProduct = { name: '', slug: '', category: 'dresses', description: '', price: 0, currency: 'USD', images: [], variants: [], attributes: {} };
    this.newProductImage = '';
  }

  updatePrice(productId: string, price: number): void {
    this.productService.updateProduct(productId, { price });
    this.products = this.productService.getProducts();
  }

  updateImage(productId: string, image: string): void {
    this.productService.updateProduct(productId, { images: [image] });
    this.products = this.productService.getProducts();
  }

  updateInventory(productId: string, sku: string, inventory: number): void {
    this.productService.updateVariantInventory(productId, sku, inventory);
    this.products = this.productService.getProducts();
  }
}
