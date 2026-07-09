import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserProfile } from '../models/product';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly storageKey = 'mruna-designs-auth';
  private readonly userSubject = new BehaviorSubject<UserProfile | null>(this.loadFromStorage());
  readonly user$ = this.userSubject.asObservable();

  login(email: string, password: string): UserProfile {
    const role = email.toLowerCase().includes('admin') ? 'admin' : 'customer';
    const user: UserProfile = {
      id: role === 'admin' ? 'admin-1' : 'user-1',
      name: role === 'admin' ? 'Mina Admin' : 'Asha Kumar',
      email,
      role,
      addresses: [],
      wishlist: ['prod-1'],
      orders: [
        { id: 'order-1001', date: '2026-07-02', total: 125.5, status: 'Delivered', items: ['Aurora Midi Dress'] }
      ]
    };

    this.userSubject.next(user);
    this.persist(user);
    return user;
  }

  register(name: string, email: string): UserProfile {
    const user: UserProfile = {
      id: `user-${Date.now()}`,
      name,
      email,
      role: 'customer',
      addresses: [],
      wishlist: [],
      orders: []
    };

    this.userSubject.next(user);
    this.persist(user);
    return user;
  }

  logout(): void {
    this.userSubject.next(null);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(this.storageKey);
    }
  }

  isAuthenticated(): boolean {
    return !!this.userSubject.value;
  }

  isAdmin(): boolean {
    return this.userSubject.value?.role === 'admin';
  }

  getUser(): UserProfile | null {
    return this.userSubject.value;
  }

  private persist(user: UserProfile | null): void {
    if (typeof window !== 'undefined') {
      if (user) {
        window.localStorage.setItem(this.storageKey, JSON.stringify(user));
      } else {
        window.localStorage.removeItem(this.storageKey);
      }
    }
  }

  private loadFromStorage(): UserProfile | null {
    if (typeof window === 'undefined') {
      return null;
    }

    const raw = window.localStorage.getItem(this.storageKey);
    return raw ? (JSON.parse(raw) as UserProfile) : null;
  }
}
