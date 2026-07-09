import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HeaderComponent } from '../components/header.component';
import { FooterComponent } from '../components/footer.component';
import { CartService } from '../services/cart.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent],
  template: `
    <app-header></app-header>
    <main class="page-shell">
      <div class="section-title">
        <div>
          <p class="eyebrow">Secure checkout</p>
          <h1>Checkout</h1>
        </div>
      </div>

      <div class="checkout-layout">
        <form class="card" (ngSubmit)="submit()">
          <h3>Shipping details</h3>
          <div class="grid">
            <input placeholder="Full name" [(ngModel)]="fullName" name="fullName" required />
            <input placeholder="Email" [(ngModel)]="email" name="email" required />
            <input placeholder="Address" [(ngModel)]="address" name="address" required />
            <input placeholder="City" [(ngModel)]="city" name="city" required />
            <input placeholder="State" [(ngModel)]="state" name="state" required />
            <input placeholder="ZIP" [(ngModel)]="zip" name="zip" required />
          </div>
          <h3>Shipping method</h3>
          <label><input type="radio" name="ship" checked /> Standard shipping · $8</label>
          <label><input type="radio" name="ship" /> Express · $16</label>
          <h3>Payment</h3>
          <p class="muted">Mock payment placeholder. Orders will appear in your account after confirmation.</p>
          <button class="btn primary">Place order</button>
        </form>

        <aside class="card summary">
          <h3>Order summary</h3>
          <div class="line" *ngFor="let item of items"><span>{{ item.name }} × {{ item.quantity }}</span><span>{{ '$' + (item.price * item.quantity).toFixed(2) }}</span></div>
          <div class="line"><span>Subtotal</span><span>{{ '$' + subtotal.toFixed(2) }}</span></div>
          <div class="line"><span>Tax</span><span>{{ '$' + tax.toFixed(2) }}</span></div>
          <div class="line"><span>Shipping</span><span>{{ '$' + shipping.toFixed(2) }}</span></div>
          <div class="line total"><span>Total</span><span>{{ '$' + total.toFixed(2) }}</span></div>
        </aside>
      </div>
    </main>
    <app-footer></app-footer>
  `,
  styles: [
    `.page-shell { padding: 1.25rem; max-width:1220px; margin:0 auto; }`,
    `.checkout-layout { display:grid; grid-template-columns:1.2fr 0.8fr; gap:1rem; }`,
    `.card { padding:1.2rem; border:1px solid #ece6df; border-radius:1rem; background:white; }`,
    `.grid { display:grid; grid-template-columns:repeat(2, minmax(0,1fr)); gap:0.75rem; }`,
    `input { padding:0.8rem 0.9rem; border:1px solid #ddd; border-radius:0.7rem; }`,
    `label { display:flex; gap:0.5rem; align-items:center; margin-top:0.5rem; }`,
    `.btn { padding:0.8rem 1.1rem; border-radius:999px; text-decoration:none; font-weight:700; border:none; cursor:pointer; display:inline-block; margin-top:0.8rem; }`,
    `.btn.primary { background:#2f241d; color:white; }`,
    `.muted { color:#6b5a4f; }`,
    `.line { display:flex; justify-content:space-between; padding:0.4rem 0; }`,
    `.line.total { font-weight:800; border-top:1px solid #ece6df; padding-top:0.8rem; }`,
    `@media (max-width: 760px) { .checkout-layout, .grid { grid-template-columns:1fr; } }`
  ]
})
export class CheckoutComponent {
  private readonly cartService = inject(CartService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  items = this.cartService.getItems();
  subtotal = this.cartService.getSubtotal();
  tax = this.cartService.getTax();
  shipping = this.cartService.getShippingEstimate();
  total = this.cartService.getTotal();
  fullName = this.authService.getUser()?.name ?? '';
  email = this.authService.getUser()?.email ?? '';
  address = '';
  city = '';
  state = '';
  zip = '';

  submit(): void {
    this.cartService.clear();
    this.router.navigate(['/account']);
  }
}
