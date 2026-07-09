import { Injectable } from '@angular/core';
import { Category, Product } from '../models/product';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly storageKey = 'mruna-designs-products';
  private readonly products: Product[] = this.loadFromStorage();

  getProducts(category?: Category): Product[] {
    if (!category) {
      return this.products;
    }
    return this.products.filter((product) => product.category === category);
  }

  createProduct(product: Product): Product {
    this.products.unshift(product);
    this.persist();
    return product;
  }

  updateProduct(productId: string, updates: Partial<Product>): Product | undefined {
    const index = this.products.findIndex((product) => product.id === productId);
    if (index === -1) {
      return undefined;
    }

    this.products[index] = { ...this.products[index], ...updates };
    this.persist();
    return this.products[index];
  }

  deleteProduct(productId: string): void {
    const index = this.products.findIndex((product) => product.id === productId);
    if (index !== -1) {
      this.products.splice(index, 1);
      this.persist();
    }
  }

  updateVariantInventory(productId: string, sku: string, inventory: number): Product | undefined {
    const product = this.products.find((item) => item.id === productId);
    if (!product) {
      return undefined;
    }

    product.variants = product.variants.map((variant) =>
      variant.sku === sku ? { ...variant, inventory } : variant
    );

    this.persist();
    return product;
  }

  getFeaturedProducts(): Product[] {
    return this.products.slice(0, 3);
  }

  getProductBySlug(slug: string): Product | undefined {
    return this.products.find((product) => product.slug === slug);
  }

  getCategories(): Array<{ slug: Category; name: string }> {
    return [
      { slug: 'dresses', name: 'Dresses' },
      { slug: 'tshirts', name: 'T-shirts' },
      { slug: 'pants', name: 'Pants' }
    ];
  }

  private loadFromStorage(): Product[] {
    if (typeof window === 'undefined') {
      return this.defaultProducts();
    }

    const raw = window.localStorage.getItem(this.storageKey);
    if (!raw) {
      return this.defaultProducts();
    }

    try {
      return JSON.parse(raw) as Product[];
    } catch {
      return this.defaultProducts();
    }
  }

  private persist(): void {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(this.storageKey, JSON.stringify(this.products));
    }
  }

  private defaultProducts(): Product[] {
    return [
      {
        id: 'prod-1',
        name: 'Aurora Midi Dress',
        slug: 'aurora-midi-dress',
        category: 'dresses',
        description: 'A polished midi dress for evenings, brunches, and celebrations.',
        price: 79.99,
        currency: 'USD',
        badge: 'Best seller',
        rating: 4.8,
        reviewsCount: 28,
        images: ['https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80'],
        attributes: { material: 'Satin', fit: 'Relaxed' },
        variants: [
          { sku: 'aurora-sand', size: 'S', color: 'Sand', price: 79.99, inventory: 12, images: ['https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80'] },
          { sku: 'aurora-ink', size: 'M', color: 'Ink', price: 84.99, inventory: 5, images: ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80'] }
        ]
      },
      {
        id: 'prod-2',
        name: 'Studio Tee',
        slug: 'studio-tee',
        category: 'tshirts',
        description: 'Soft cotton tee with a sculpted neckline and everyday comfort.',
        price: 34.5,
        currency: 'USD',
        rating: 4.4,
        reviewsCount: 11,
        images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80'],
        attributes: { material: 'Cotton', fit: 'Regular' },
        variants: [
          { sku: 'studio-tee-cream', size: 'S', color: 'Cream', price: 34.5, inventory: 18, images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80'] },
          { sku: 'studio-tee-graphite', size: 'L', color: 'Graphite', price: 36.5, inventory: 9, images: ['https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80'] }
        ]
      },
      {
        id: 'prod-3',
        name: 'Contour Wide-Leg Pants',
        slug: 'contour-wide-leg-pants',
        category: 'pants',
        description: 'Fluid, tailored pants with a dramatic wide leg and easy drape.',
        price: 62.0,
        currency: 'USD',
        badge: 'New',
        rating: 4.7,
        reviewsCount: 16,
        images: ['https://images.unsplash.com/photo-1487412912498-0447578fcca8?auto=format&fit=crop&w=900&q=80'],
        attributes: { material: 'Viscose', fit: 'Wide leg' },
        variants: [
          { sku: 'contour-olive', size: 'M', color: 'Olive', price: 62.0, inventory: 7, images: ['https://images.unsplash.com/photo-1487412912498-0447578fcca8?auto=format&fit=crop&w=900&q=80'] },
          { sku: 'contour-espresso', size: 'L', color: 'Espresso', price: 64.0, inventory: 4, images: ['https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80'] }
        ]
      },
      {
        id: 'prod-4',
        name: 'Nora Linen Dress',
        slug: 'nora-linen-dress',
        category: 'dresses',
        description: 'An airy linen dress that transitions from daylight to evening with ease.',
        price: 58.0,
        currency: 'USD',
        rating: 4.5,
        reviewsCount: 9,
        images: ['https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80'],
        attributes: { material: 'Linen', fit: 'A-line' },
        variants: [
          { sku: 'nora-ecru', size: 'M', color: 'Ecru', price: 58.0, inventory: 15, images: ['https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80'] }
        ]
      },
      {
        id: 'prod-5',
        name: 'Riven Oversized Tee',
        slug: 'riven-oversized-tee',
        category: 'tshirts',
        description: 'A modern oversized tee with a relaxed silhouette and soft knit.',
        price: 29.0,
        currency: 'USD',
        rating: 4.2,
        reviewsCount: 7,
        images: ['https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80'],
        attributes: { material: 'Modal blend', fit: 'Oversized' },
        variants: [
          { sku: 'riven-black', size: 'L', color: 'Black', price: 29.0, inventory: 10, images: ['https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80'] }
        ]
      },
      {
        id: 'prod-6',
        name: 'Mila Tailored Pants',
        slug: 'mila-tailored-pants',
        category: 'pants',
        description: 'Slim-tailored pants designed for polished workwear and weekend dressing.',
        price: 54.0,
        currency: 'USD',
        rating: 4.6,
        reviewsCount: 13,
        images: ['https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80'],
        attributes: { material: 'Twill', fit: 'Tailored' },
        variants: [
          { sku: 'mila-charcoal', size: 'S', color: 'Charcoal', price: 54.0, inventory: 6, images: ['https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80'] }
        ]
      }
    ];
  }
}
