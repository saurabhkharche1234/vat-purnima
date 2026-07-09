import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../components/header.component';
import { FooterComponent } from '../components/footer.component';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent, FooterComponent],
  template: `
    <app-header></app-header>
    <main class="page-shell">
      <div class="section-title">
        <div>
          <p class="eyebrow">Your bag</p>
          <h1>Cart</h1>
        </div>
        <a routerLink="/checkout" class="btn primary" *ngIf="items.length">Checkout</a>
      </div>

      <div class="cart-layout" *ngIf="items.length; else empty">
        <div class="items-list">
          <article class="cart-item" *ngFor="let item of items">
            <img [src]="item.image" [alt]="item.name" />
            <div class="detail">
              <h3>{{ item.name }}</h3>
              <p>{{ item.variantSku }}</p>
              <div class="actions">
                <button (click)="updateQuantity(item.variantSku, item.quantity - 1)">−</button>
                <span>{{ item.quantity }}</span>
                <button (click)="updateQuantity(item.variantSku, item.quantity + 1)">+</button>
              </div>
            </div>
            <div class="price-block">
              <strong>{{ '$' + (item.price * item.quantity).toFixed(2) }}</strong>
              <button class="text-btn" (click)="remove(item.variantSku)">Remove</button>
            </div>
          </article>
        </div>

        <aside class="summary-card">
          <h3>Order summary</h3>
          <div class="line"><span>Subtotal</span><span>{{ '$' + subtotal.toFixed(2) }}</span></div>
          <div class="line"><span>Estimated tax</span><span>{{ '$' + tax.toFixed(2) }}</span></div>
          <div class="line"><span>Shipping</span><span>{{ '$' + shipping.toFixed(2) }}</span></div>
          <div class="line total"><span>Total</span><span>{{ '$' + total.toFixed(2) }}</span></div>
          <a routerLink="/checkout" class="btn primary full">Proceed to checkout</a>
        </aside>
      </div>

      <ng-template #empty>
        <div class="empty-card">
          <h2>Your cart is empty.</h2>
          <p>Start building your edit with dresses, t-shirts, and polished pants.</p>
          <a routerLink="/" class="btn primary">Continue shopping</a>
        </div>
      </ng-template>
    </main>
    <app-footer></app-footer>
  `,
  styles: [
    `.page-shell { padding: 1.25rem; max-width:1220px; margin:0 auto; }`,
    `.section-title { display:flex; justify-content:space-between; align-items:center; gap:1rem; margin-bottom:1rem; }`,
    `.eyebrow { text-transform:uppercase; letter-spacing:0.2em; color:#b86b3c; font-weight:700; }`,
    `.cart-layout { display:grid; grid-template-columns:1.2fr 0.8fr; gap:1rem; }`,
    `.items-list { display:flex; flex-direction:column; gap:0.8rem; }`,
    `.cart-item { display:grid; grid-template-columns:90px 1fr auto; gap:1rem; align-items:center; padding:1rem; border:1px solid #ece6df; border-radius:1rem; background:white; }`,
    `.cart-item img { width:90px; height:90px; object-fit:cover; border-radius:0.75rem; }`,
    `.actions { display:flex; gap:0.5rem; align-items:center; margin-top:0.4rem; }`,
    `.actions button { width:28px; height:28px; border:none; border-radius:999px; background:#f4e8dc; cursor:pointer; }`,
    `.price-block { display:flex; flex-direction:column; gap:0.4rem; align-items:flex-end; }`,
    `.summary-card, .empty-card { padding:1.2rem; border:1px solid #ece6df; border-radius:1rem; background:white; }`,
    `.line { display:flex; justify-content:space-between; padding:0.4rem 0; }`,
    `.line.total { font-weight:800; border-top:1px solid #ece6df; margin-top:0.4rem; padding-top:0.8rem; }`,
    `.btn { padding:0.8rem 1.1rem; border-radius:999px; text-decoration:none; font-weight:700; border:none; cursor:pointer; display:inline-block; }`,
    `.btn.primary { background:#2f241d; color:white; }`,
    `.full { width:100%; text-align:center; margin-top:0.8rem; }`,
    `.text-btn { background:none; border:none; color:#b86b3c; cursor:pointer; padding:0; }`,
    `@media (max-width: 760px) { .cart-layout { grid-template-columns:1fr; } .cart-item { grid-template-columns:1fr; } .price-block { align-items:flex-start; } }`
  ]
})
export class CartComponent {
  readonly cartService = inject(CartService);
  items = this.cartService.getItems();
  subtotal = this.cartService.getSubtotal();
  tax = this.cartService.getTax();
  shipping = this.cartService.getShippingEstimate();
  total = this.cartService.getTotal();

  updateQuantity(variantSku: string, quantity: number): void {
    this.cartService.updateQuantity(variantSku, quantity);
    this.refresh();
  }

  remove(variantSku: string): void {
    this.cartService.removeItem(variantSku);
    this.refresh();
  }

  private refresh(): void {
    this.items = this.cartService.getItems();
    this.subtotal = this.cartService.getSubtotal();
    this.tax = this.cartService.getTax();
    this.shipping = this.cartService.getShippingEstimate();
    this.total = this.cartService.getTotal();
  }
}
