import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HeaderComponent } from '../components/header.component';
import { FooterComponent } from '../components/footer.component';
import { ProductService } from '../services/product.service';
import { Category, Product } from '../models/product';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent, FooterComponent],
  template: `
    <app-header></app-header>
    <main class="page-shell">
      <div class="section-title">
        <div>
          <p class="eyebrow">Collection</p>
          <h1>{{ title }}</h1>
        </div>
        <p class="count">{{ products.length }} styles</p>
      </div>
      <div class="filters">
        <span>Filter by</span>
        <span>Size: S/M/L</span>
        <span>Color: neutral, earth, dark</span>
        <span>Price: $20-$90</span>
      </div>
      <div class="product-grid">
        <article class="product-card" *ngFor="let product of products">
          <img [src]="product.images[0]" [alt]="product.name" />
          <div class="product-info">
            <h3>{{ product.name }}</h3>
            <p>{{ product.description }}</p>
            <div class="product-footer">
              <span>{{ '$' + product.price.toFixed(2) }}</span>
              <a [routerLink]="'/product/' + product.slug">View</a>
            </div>
          </div>
        </article>
      </div>
    </main>
    <app-footer></app-footer>
  `,
  styles: [
    `.page-shell { padding: 1.25rem; max-width:1220px; margin:0 auto; }`,
    `.section-title { display:flex; justify-content:space-between; align-items:center; gap:1rem; margin-bottom:0.75rem; }`,
    `.eyebrow { text-transform:uppercase; letter-spacing:0.2em; color:#b86b3c; font-weight:700; }`,
    `.filters { display:flex; gap:0.75rem; flex-wrap:wrap; color:#6b5a4f; margin-bottom:1rem; }`,
    `.product-grid { display:grid; grid-template-columns:repeat(3, minmax(0,1fr)); gap:1rem; }`,
    `.product-card { border:1px solid #ece6df; border-radius:1rem; overflow:hidden; background:white; }`,
    `.product-card img { width:100%; height:220px; object-fit:cover; }`,
    `.product-info { padding:1rem; display:flex; flex-direction:column; gap:0.55rem; }`,
    `.product-footer { display:flex; justify-content:space-between; align-items:center; }`,
    `.product-footer a { color:#b86b3c; font-weight:700; text-decoration:none; }`,
    `@media (max-width: 760px) { .product-grid { grid-template-columns:1fr; } .section-title { flex-direction:column; align-items:flex-start; } }`
  ]
})
export class CategoryComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);
  products: Product[] = [];
  title = 'Collection';

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const category = params['slug'] as Category;
      this.products = this.productService.getProducts(category);
      this.title = category === 'dresses' ? 'Dresses' : category === 'tshirts' ? 'T-shirts' : 'Pants';
    });
  }
}
