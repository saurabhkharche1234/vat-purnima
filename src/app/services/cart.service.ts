import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../models/product';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly storageKey = 'mruna-designs-cart';
  private readonly itemsSubject = new BehaviorSubject<CartItem[]>(this.loadFromStorage());
  readonly items$ = this.itemsSubject.asObservable();

  addItem(item: CartItem): void {
    const current = this.itemsSubject.value;
    const existing = current.find((entry) => entry.variantSku === item.variantSku);

    if (existing) {
      const updated = current.map((entry) =>
        entry.variantSku === item.variantSku ? { ...entry, quantity: entry.quantity + item.quantity } : entry
      );
      this.itemsSubject.next(updated);
    } else {
      this.itemsSubject.next([...current, item]);
    }

    this.persist();
  }

  updateQuantity(variantSku: string, quantity: number): void {
    const updated = this.itemsSubject.value
      .map((item) => (item.variantSku === variantSku ? { ...item, quantity } : item))
      .filter((item) => item.quantity > 0);
    this.itemsSubject.next(updated);
    this.persist();
  }

  removeItem(variantSku: string): void {
    const updated = this.itemsSubject.value.filter((item) => item.variantSku !== variantSku);
    this.itemsSubject.next(updated);
    this.persist();
  }

  clear(): void {
    this.itemsSubject.next([]);
    this.persist();
  }

  getItems(): CartItem[] {
    return this.itemsSubject.value;
  }

  getSubtotal(): number {
    return this.itemsSubject.value.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  getTax(): number {
    return this.getSubtotal() * 0.08;
  }

  getShippingEstimate(): number {
    return this.getSubtotal() > 0 ? 8 : 0;
  }

  getTotal(): number {
    return this.getSubtotal() + this.getTax() + this.getShippingEstimate();
  }

  private persist(): void {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(this.storageKey, JSON.stringify(this.itemsSubject.value));
    }
  }

  private loadFromStorage(): CartItem[] {
    if (typeof window === 'undefined') {
      return [];
    }

    const raw = window.localStorage.getItem(this.storageKey);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  }
}
