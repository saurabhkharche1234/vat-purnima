import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HeaderComponent } from '../components/header.component';
import { FooterComponent } from '../components/footer.component';
import { ProductService } from '../services/product.service';
import { CartService } from '../services/cart.service';
import { Product, ProductVariant } from '../models/product';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent, FooterComponent],
  template: `
    <app-header></app-header>
    <main class="page-shell" *ngIf="product; else missing">
      <div class="product-layout">
        <div class="media-card">
          <img [src]="selectedVariantImage" [alt]="product.name" />
        </div>
        <div class="details">
          <p class="eyebrow">{{ product.category }}</p>
          <h1>{{ product.name }}</h1>
          <p class="description">{{ product.description }}</p>
          <div class="price-row">
            <strong>{{ '$' + ((selectedVariant?.price ?? product.price).toFixed(2)) }}</strong>
            <span>★ {{ product.rating }} · {{ product.reviewsCount }} reviews</span>
          </div>

          <div class="variant-section">
            <h3>Choose your variant</h3>
            <div class="variant-list">
              <button *ngFor="let variant of product.variants" (click)="selectVariant(variant)" [class.active]="selectedVariant?.sku === variant.sku">
                {{ variant.color }} / {{ variant.size }}
              </button>
            </div>
          </div>

          <div class="meta">
            <p><strong>Material:</strong> {{ product.attributes['material'] }}</p>
            <p><strong>Fit:</strong> {{ product.attributes['fit'] }}</p>
            <p><strong>Inventory:</strong> {{ selectedVariant?.inventory || 0 }} available</p>
          </div>

          <div class="actions">
            <button class="btn primary" (click)="addToCart()">Add to cart</button>
            <a routerLink="/cart" class="btn secondary">View cart</a>
          </div>
        </div>
      </div>
    </main>
    <ng-template #missing>
      <main class="page-shell">
        <h2>Product not found.</h2>
      </main>
    </ng-template>
    <app-footer></app-footer>
  `,
  styles: [
    `.page-shell { padding: 1.25rem; max-width:1220px; margin:0 auto; }`,
    `.product-layout { display:grid; grid-template-columns:1.1fr 0.9fr; gap:1.5rem; align-items:start; }`,
    `.media-card { background:#fff; border:1px solid #ece6df; border-radius:1.2rem; padding:1rem; }`,
    `.media-card img { width:100%; border-radius:1rem; height:420px; object-fit:cover; }`,
    `.details { display:flex; flex-direction:column; gap:0.9rem; }`,
    `.eyebrow { text-transform:uppercase; letter-spacing:0.2em; color:#b86b3c; font-weight:700; }`,
    `.price-row { display:flex; justify-content:space-between; align-items:center; gap:1rem; background:#f9f2ea; padding:0.9rem 1rem; border-radius:0.8rem; }`,
    `.variant-list { display:flex; flex-wrap:wrap; gap:0.65rem; }`,
    `.variant-list button { border:1px solid #d4c2ab; background:white; padding:0.7rem 0.9rem; border-radius:999px; cursor:pointer; }`,
    `.variant-list button.active { background:#2f241d; color:white; border-color:#2f241d; }`,
    `.actions { display:flex; gap:0.75rem; flex-wrap:wrap; }`,
    `.btn { padding:0.8rem 1.1rem; border-radius:999px; text-decoration:none; font-weight:700; border:none; cursor:pointer; }`,
    `.btn.primary { background:#2f241d; color:white; }`,
    `.btn.secondary { background:#f4e8dc; color:#2f241d; }`,
    `@media (max-width: 760px) { .product-layout { grid-template-columns:1fr; } .media-card img { height:300px; } }`
  ]
})
export class ProductComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);
  product?: Product;
  selectedVariant?: ProductVariant;

  get selectedVariantImage(): string {
    return this.selectedVariant?.images?.[0] || this.product?.images?.[0] || '';
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const product = this.productService.getProductBySlug(params['slug']);
      this.product = product;
      this.selectedVariant = product?.variants[0];
    });
  }

  selectVariant(variant: ProductVariant): void {
    this.selectedVariant = variant;
  }

  addToCart(): void {
    if (!this.product || !this.selectedVariant) {
      return;
    }

    this.cartService.addItem({
      id: `${this.product.id}-${this.selectedVariant.sku}`,
      productId: this.product.id,
      variantSku: this.selectedVariant.sku,
      name: this.product.name,
      price: this.selectedVariant.price,
      quantity: 1,
      image: this.selectedVariant.images[0] || this.product.images[0]
    });
  }
}
