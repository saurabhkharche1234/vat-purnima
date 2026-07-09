import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../components/header.component';
import { FooterComponent } from '../components/footer.component';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent, FooterComponent],
  template: `
    <app-header></app-header>
    <main class="page-shell">
      <section class="hero">
        <div>
          <p class="eyebrow">Spring / Summer 2026</p>
          <h1>Modern staples for bold everyday dressing.</h1>
          <p class="hero-copy">Discover dresses, t-shirts, and pants designed to move easily from workdays to evenings.</p>
          <div class="hero-actions">
            <a routerLink="/category/dresses" class="btn primary">Shop dresses</a>
            <a routerLink="/category/tshirts" class="btn secondary">Explore basics</a>
          </div>
        </div>
        <div class="hero-card">
          <h3>Free shipping over $75</h3>
          <p>Easy exchanges, curated essentials, and low-stock alerts for your favorites.</p>
        </div>
      </section>

      <section class="categories">
        <a *ngFor="let category of categories" [routerLink]="'/category/' + category.slug" class="category-card">
          <h3>{{ category.name }}</h3>
          <p>Shop the latest in {{ category.name.toLowerCase() }}.</p>
        </a>
      </section>

      <section class="products">
        <div class="section-title">
          <h2>Featured picks</h2>
          <a routerLink="/category/dresses">See all</a>
        </div>
        <div class="product-grid">
          <article class="product-card" *ngFor="let product of featuredProducts">
            <img [src]="product.images[0]" [alt]="product.name" />
            <div class="product-info">
              <p class="product-badge" *ngIf="product.badge">{{ product.badge }}</p>
              <h3>{{ product.name }}</h3>
              <p>{{ product.description }}</p>
              <div class="product-footer">
                <span>{{ '$' + product.price.toFixed(2) }}</span>
                <a [routerLink]="'/product/' + product.slug">View product</a>
              </div>
            </div>
          </article>
        </div>
      </section>
    </main>
    <app-footer></app-footer>
  `,
  styles: [
    `.page-shell { padding: 1.25rem; max-width:1220px; margin:0 auto; }`,
    `.hero { display:grid; grid-template-columns: 1.3fr 0.8fr; gap:1.25rem; padding:2rem 0 1.5rem; align-items:center; }`,
    `.eyebrow { text-transform:uppercase; letter-spacing:0.2em; color:#b86b3c; font-weight:700; }`,
    `h1 { font-size:clamp(2rem, 3.5vw, 3.2rem); margin:0.25rem 0 0.75rem; color:#2f241d; }`,
    `.hero-copy { font-size:1.05rem; color:#6b5a4f; max-width:600px; }`,
    `.hero-actions { display:flex; gap:0.75rem; margin-top:1rem; flex-wrap:wrap; }`,
    `.btn { padding:0.8rem 1.1rem; border-radius:999px; text-decoration:none; font-weight:700; }`,
    `.btn.primary { background:#2f241d; color:white; }`,
    `.btn.secondary { background:#f4e8dc; color:#2f241d; }`,
    `.hero-card { background:linear-gradient(135deg,#f7e9dc,#fffdf9); border:1px solid #ece6df; padding:1.2rem; border-radius:1.2rem; }`,
    `.categories { display:grid; grid-template-columns:repeat(3, minmax(0,1fr)); gap:1rem; margin:1.5rem 0 2rem; }`,
    `.category-card { padding:1.1rem; border-radius:1rem; background:#fff; border:1px solid #ece6df; text-decoration:none; color:inherit; }`,
    `.products { margin-top:1rem; }`,
    `.section-title { display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; }`,
    `.section-title a { color:#b86b3c; font-weight:600; text-decoration:none; }`,
    `.product-grid { display:grid; grid-template-columns:repeat(3, minmax(0,1fr)); gap:1rem; }`,
    `.product-card { border:1px solid #ece6df; border-radius:1.1rem; overflow:hidden; background:white; }`,
    `.product-card img { width:100%; height:220px; object-fit:cover; }`,
    `.product-info { padding:1rem; display:flex; flex-direction:column; gap:0.45rem; }`,
    `.product-badge { font-size:0.8rem; color:#b86b3c; font-weight:700; text-transform:uppercase; letter-spacing:0.12em; }`,
    `.product-footer { display:flex; justify-content:space-between; align-items:center; margin-top:0.4rem; }`,
    `.product-footer a { color:#b86b3c; text-decoration:none; font-weight:700; }`,
    `@media (max-width: 760px) { .hero, .categories, .product-grid { grid-template-columns:1fr; } .page-shell { padding:1rem; } }`
  ]
})
export class HomeComponent {
  private readonly productService = inject(ProductService);
  readonly categories = this.productService.getCategories();
  readonly featuredProducts = this.productService.getFeaturedProducts();
}
