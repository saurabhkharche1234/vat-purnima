import { TestBed } from '@angular/core/testing';
import { provideRouter, RouterLink } from '@angular/router';
import { AccountComponent } from './account.component';
import { AuthService } from '../services/auth.service';
import { ProductService } from '../services/product.service';

class MockAuthService {
  getUser() {
    return {
      id: 'admin-1',
      name: 'Mina Admin',
      email: 'admin@example.com',
      role: 'admin',
      addresses: [],
      wishlist: [],
      orders: []
    };
  }

  logout() {}

  isAdmin() {
    return true;
  }

  isAuthenticated() {
    return true;
  }
}

describe('AccountComponent', () => {
  it('should show the admin workspace for admin users', async () => {
    await TestBed.configureTestingModule({
      imports: [AccountComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useClass: MockAuthService },
        ProductService
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(AccountComponent);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Admin workspace');
  });
});
