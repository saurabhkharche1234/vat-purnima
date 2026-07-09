# mruna-designs frontend migration plan

## 1. Executive summary

The current repository is an Angular single-page app that renders a celebration page for “vat-purnima”. It is not yet an ecommerce storefront, but it already provides a working Angular workspace, SSR setup, and a basic asset pipeline that can be repurposed.

For the new experience, the recommended target stack is:

- Framework: Next.js 14+ with React 18+ and TypeScript
- Styling: Tailwind CSS
- Data fetching: React Query (TanStack Query)
- State: Zustand for cart/checkout and React Query for server state
- Forms: React Hook Form + zod
- Auth: NextAuth or a custom JWT hook if the backend owns session handling
- Testing: Jest + React Testing Library + Cypress

### Why this stack

- Next.js is the best fit for ecommerce SEO because it supports SSR/ISR and strong metadata handling.
- Tailwind accelerates UI delivery and keeps styling consistent across public and admin experiences.
- React Query reduces boilerplate around product lists, product detail, and order data while handling caching and background refresh.
- Zustand is lightweight for local cart and checkout state without the overhead of a large global store.

### Trade-offs

- Angular is already in the repo, but Next.js is better aligned with SEO-first ecommerce requirements and faster iteration for storefront teams.
- Tailwind is faster than CSS Modules/SASS for a design-heavy storefront, but teams should define design tokens early to avoid drift.

---

## 2. Short audit report of the current repo

### What can be reused

- Existing Angular workspace and build pipeline
- SSR support already present in the project scaffolding
- Asset folder and public/static hosting structure
- Basic TypeScript configuration and testing setup

### Tech debt / limitations

- The current app is a one-page celebration experience, not a product-driven storefront
- There is no routing, catalog, cart, auth, or admin domain model yet
- CSS is highly page-specific and uses broad global selectors, which will conflict with a new design system
- The app title and metadata still reflect the old brand

### Critical missing pieces

- Product catalog and variant model
- Public route structure for listing, detail, cart, checkout, account, and auth
- Admin route structure and protected access
- Content/SEO metadata
- Cart persistence and checkout flow
- API integration layer and error handling

---

## 3. Target experience and product scope

### Brand and product categories

- Brand: mruna-designs
- Categories:
  - Dresses
  - T-shirts
  - Pants
- Product capabilities:
  - Variants by size and color
  - SKU support
  - Inventory count
  - Price and currency support
  - Reviews and rating display

### Core user journeys

1. Browse products by category and filter by size, color, and price
2. View product detail, select a variant, and add to cart
3. Review cart, estimate shipping, and complete checkout
4. Create an account, view orders, save addresses, and manage wishlist
5. Admin users create/edit/delete products and manage inventory/orders

---

## 4. Recommended architecture

```text
src/
  app/
    (public)/
      page.tsx
      about/page.tsx
      contact/page.tsx
      terms/page.tsx
      category/[slug]/page.tsx
      product/[slug]/page.tsx
      cart/page.tsx
      checkout/page.tsx
      login/page.tsx
      register/page.tsx
      account/(routes)/...
    (admin)/
      admin/login/page.tsx
      admin/dashboard/page.tsx
      admin/products/page.tsx
      admin/products/new/page.tsx
      admin/products/[id]/edit/page.tsx
      admin/inventory/page.tsx
      admin/orders/page.tsx
      admin/users/page.tsx
      admin/reports/page.tsx
  components/
    Product/ProductCard.tsx
    Product/ProductGrid.tsx
    Product/Filters.tsx
    Product/ImageGallery.tsx
    Product/VariantPicker.tsx
    Cart/CartDrawer.tsx
    Cart/CartSummary.tsx
    Auth/LoginForm.tsx
    Auth/RegisterForm.tsx
    Admin/ProductForm.tsx
    Layout/Header.tsx
    Layout/Footer.tsx
    Shared/Breadcrumbs.tsx
    Shared/Modal.tsx
    Shared/Notifications.tsx
  hooks/
    useCart.ts
    useAuth.ts
    useDebounce.ts
  lib/
    api.ts
    auth.ts
    utils.ts
    metadata.ts
  stores/
    cart-store.ts
    checkout-store.ts
  styles/globals.css
  types/
    product.ts
    cart.ts
    auth.ts
    order.ts
  tests/
    components/
    e2e/
```

### Folder responsibilities

- app/: route-level pages and layouts
- components/: UI building blocks for public and admin experiences
- hooks/: reusable logic for cart, auth, debounce, and forms
- lib/: API clients, auth helpers, constants, metadata, formatting utilities
- stores/: Zustand stores for cart and checkout state
- styles/: Tailwind config and global styles
- types/: shared TypeScript contracts
- tests/: unit and e2e coverage

---

## 5. Page and component inventory

### Public pages

| Page | Purpose | Notes |
| --- | --- | --- |
| Home | Hero, featured categories, latest products | SEO-critical landing page |
| Category listing | Filterable collection by type | Supports sorting, pagination |
| Product detail | Gallery, variants, reviews, add-to-cart | SSR/ISR-friendly |
| Cart | Quantity updates, summary, shipping estimate | Local persistence |
| Checkout | Shipping, method, payment placeholder, confirmation | Protected route |
| Login / Register | User auth entry points | Separate from admin |
| Account | Orders, addresses, wishlist, profile | Protected route |
| Search results | Keyword-based discovery | Server-side search or API-backed |
| About / Contact / Terms | Static content and trust pages | SEO-friendly |

### Admin pages

| Page | Purpose |
| --- | --- |
| Admin login | Separate admin auth |
| Dashboard | Sales, top products, low stock alerts |
| Products | CRUD listing, filters, bulk import |
| Product create/edit | Variant and inventory editing |
| Inventory | Adjust stock, view low-stock alerts |
| Orders | Manage statuses, refund placeholders |
| Users | View customers |
| Reports | Basic analytics export |

### Reusable components

- Header with cart indicator and mobile menu
- Footer with newsletter and links
- ProductCard and ProductGrid
- Filters and sorting controls
- Pagination and Breadcrumbs
- Modal and Notifications
- ImageGallery and SizeSelector
- VariantPicker and AddToCartButton

---

## 6. Data models and API contracts

### Product contract

```json
{
  "id": "prod_123",
  "name": "Aurora Midi Dress",
  "slug": "aurora-midi-dress",
  "category": "dresses",
  "description": "Soft satin midi dress with elegant drape.",
  "price": 79.99,
  "currency": "USD",
  "variants": [
    {
      "sku": "aurora-midi-dress-sand",
      "size": "S",
      "color": "Sand",
      "price": 79.99,
      "inventory": 12,
      "images": ["https://cdn.example.com/products/aurora-1.jpg"]
    },
    {
      "sku": "aurora-midi-dress-ink",
      "size": "M",
      "color": "Ink",
      "price": 84.99,
      "inventory": 4,
      "images": ["https://cdn.example.com/products/aurora-2.jpg"]
    }
  ],
  "images": [
    "https://cdn.example.com/products/aurora-1.jpg",
    "https://cdn.example.com/products/aurora-2.jpg"
  ],
  "attributes": {
    "material": "satin",
    "fit": "relaxed"
  },
  "rating": 4.6,
  "reviewsCount": 18,
  "createdAt": "2026-07-01T10:00:00.000Z"
}
```

### Cart item contract

```json
{
  "productId": "prod_123",
  "variantSku": "aurora-midi-dress-sand",
  "name": "Aurora Midi Dress",
  "price": 79.99,
  "quantity": 2,
  "image": "https://cdn.example.com/products/aurora-1.jpg"
}
```

### Checkout request

```json
{
  "items": [
    {
      "productId": "prod_123",
      "variantSku": "aurora-midi-dress-sand",
      "quantity": 2
    }
  ],
  "shippingAddress": {
    "fullName": "Asha Kumar",
    "line1": "123 Main St",
    "city": "Austin",
    "state": "TX",
    "postalCode": "78701",
    "country": "US"
  },
  "shippingMethod": "standard",
  "paymentMethod": "mock_card",
  "currency": "USD"
}
```

### Checkout response

```json
{
  "orderId": "ord_1001",
  "status": "pending",
  "subtotal": 159.98,
  "tax": 12.8,
  "shipping": 5.0,
  "total": 177.78,
  "estimatedDelivery": "2026-07-14"
}
```

### Auth response

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
  "refreshToken": "refresh_abc123",
  "expiresIn": 900,
  "user": {
    "id": "usr_1",
    "name": "Asha",
    "email": "asha@example.com",
    "role": "customer"
  }
}
```

### API endpoints and expectations

| Method | Endpoint | Purpose | Notes |
| --- | --- | --- | --- |
| GET | /api/products | Product list with filters and pagination | Support category, size, color, minPrice, maxPrice, sort |
| GET | /api/products/[slug] | Product detail | Returns variants and reviews |
| POST | /api/auth/login | Login | 200 or 401 on invalid credentials |
| POST | /api/auth/register | Register | 201 or 409 on duplicate email |
| POST | /api/auth/refresh | Refresh tokens | 200 or 401 on expired token |
| POST | /api/checkout | Create order | 201 or 422 for validation issues |
| GET | /api/account/orders | User order history | Protected |
| POST | /api/admin/products | Create product | Admin-only |
| PATCH | /api/admin/products/[id] | Update product | Admin-only |
| DELETE | /api/admin/products/[id] | Delete product | Admin-only |
| POST | /api/admin/import/products | Bulk import CSV | Admin-only |

### Validation and error examples

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid checkout payload",
    "details": [
      { "field": "shippingAddress.postalCode", "message": "Postal code is required" }
    ]
  }
}
```

Status codes:

- 200 OK
- 201 Created
- 204 No Content
- 400 Bad Request
- 401 Unauthorized
- 403 Forbidden
- 404 Not Found
- 409 Conflict
- 422 Unprocessable Entity
- 500 Internal Server Error

---

## 7. Routing map

```text
/ → Home
/category/:slug → Category listing
/product/:slug → Product detail
/cart → Cart
/checkout → Checkout (protected)
/account → Account overview
/account/orders → Order history
/account/addresses → Saved addresses
/account/wishlist → Wishlist
/login → Customer login
/register → Customer registration
/admin/login → Admin login
/admin/dashboard → Dashboard
/admin/products → Product list
/admin/products/new → Create product
/admin/products/:id/edit → Edit product
/admin/inventory → Inventory management
/admin/orders → Order management
/admin/users → User management
/admin/reports → Analytics
```

### Route protection rules

- Public routes: home, category, product, cart, checkout (guest allowed but redirect after login), login, register, about, contact, terms
- Protected customer routes: account, wishlist, order history, checkout completion
- Protected admin routes: all /admin/* routes and admin-only APIs

---

## 8. UI/UX and wireframe notes

### Home page wireframe

```text
[Header]
  Logo | Search | Account | Cart
[Hero banner]
[Featured categories]
[New arrivals grid]
[Testimonials / brand story]
[Footer]
```

### Category page wireframe

```text
[Header]
[Breadcrumbs]
[Filter sidebar] [Product grid]
[Pagination]
[Footer]
```

### Product detail wireframe

```text
[Header]
[Breadcrumbs]
[Image gallery] [Product info + variants + price + CTA]
[Description] [Reviews]
[Related products]
[Footer]
```

### Cart and checkout wireframe

```text
Cart:
[Item list] [Summary]

Checkout:
[Shipping form] [Shipping method] [Payment placeholder] [Order summary]
```

### Admin dashboard wireframe

```text
[Sidebar]
[Stats cards]
[Low stock alerts]
[Recent orders]
[Top products]
```

### Mobile-first notes

- Header collapses to a hamburger menu on small screens
- Sticky cart CTA appears on product pages and cart views
- Filters become a drawer or bottom sheet
- Product cards should stack cleanly with large tap targets

### Accessibility notes

- WCAG AA contrast and focus-visible states
- Keyboard-friendly modal and menu behavior
- Alt text for all images and decorative images hidden appropriately
- Form labels and error text must be programmatically associated

---

## 9. State and caching strategy

- Use React Query for product lists, product details, account orders, and analytics
- Use Zustand for cart and checkout state with persisted localStorage
- Sync cart to backend after login and on checkout
- Use optimistic updates for add-to-cart and inventory adjustments, with rollback on failure
- Cache invalidation rules:
  - Product list invalidated when stock or product data changes
  - Order history invalidated after checkout or status change
  - Cart state rehydrated from localStorage on app load

---

## 10. Authentication and security

### Authentication model

- Separate customer auth and admin auth
- Access tokens short-lived; refresh tokens rotate securely
- Store tokens in secure HTTP-only cookies when possible; otherwise use memory plus refresh endpoint
- Protect routes using role-based guards

### Security notes

- Use CSRF protection if cookies are used
- Sanitize any rich text descriptions and user-generated content
- Never trust client-side inventory values without server confirmation
- Validate forms with zod on both client and server

---

## 11. Performance, SEO, and analytics

### Performance

- Optimize images with responsive formats and lazy loading
- Use CDN-backed image delivery
- Split bundle by route and lazy-load admin modules
- Use server-side rendering or static generation for product and category pages

### SEO

- Add unique metadata per product and category page
- Use structured data with JSON-LD for Product and Organization entities
- Ensure canonical URLs and sitemap generation
- Keep content readable and indexable

### Example Product schema

```html
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Aurora Midi Dress",
    "image": ["https://cdn.example.com/products/aurora-1.jpg"],
    "description": "Soft satin midi dress with elegant drape.",
    "sku": "aurora-midi-dress-sand",
    "offers": {
      "@type": "Offer",
      "priceCurrency": "USD",
      "price": "79.99",
      "availability": "https://schema.org/InStock"
    }
  }
</script>
```

### Analytics events

- product_viewed
- product_variant_selected
- add_to_cart
- checkout_started
- order_completed
- admin_product_created

---

## 12. Testing and QA checklist

### Unit tests

- ProductCard renders price and selected variant correctly
- Filters update query params correctly
- Cart reducer/Store adds, removes, and updates quantity
- Auth guards redirect based on role

### Integration tests

- Add product to cart from detail page
- Checkout flow with mocked payment
- Account login and order history loading

### E2E tests

- Browse category → product detail → add to cart → checkout
- Admin create product → inventory update → order status change

### QA checklist

- Responsive on mobile, tablet, desktop
- Keyboard navigation works end-to-end
- Forms show validation errors clearly
- Empty and error states are handled gracefully
- Accessibility audit passes basic axe and Lighthouse thresholds

---

## 13. Acceptance criteria

The migration is considered successful when:

- A customer can browse categories, filter and sort products, view a detail page, add a variant to cart, and complete checkout with a mock payment
- Cart state persists across reloads and merges correctly after login
- Admin users can create, edit, and delete products with variants, bulk-import catalog data, and manage inventory and orders
- All customer and admin routes are protected correctly
- Product pages include SEO metadata and structured data
- The UI is responsive and passes basic accessibility checks
- Linting and tests run in CI with a defined baseline

### Suggested baseline targets

- Unit test coverage: 70%+
- Lighthouse performance: 90+ on mobile for home and category pages
- Accessibility: 95+ on key flows

---

## 14. Phased implementation timeline

### Sprint 0 — Discovery and foundation (2 days)

- Confirm branding, content, assets, and product dataset
- Decide on Next.js vs SPA and final design tokens
- Set up repository split between public and admin experiences

### Sprint 1 — Core storefront shell (1 week)

- Bootstrap Next.js + TypeScript + Tailwind
- Implement global layout, header, footer, and routing
- Build home, category, and product listing pages

### Sprint 2 — Product detail and cart (1 week)

- Build product detail page with gallery and variant picker
- Implement cart store, add/remove/update quantity, and persistence
- Add shipping estimate and cart summary

### Sprint 3 — Auth, account, and checkout (1 week)

- Implement login/register and protected account routes
- Build saved addresses, wishlist, and order history UI
- Add checkout flow skeleton and order confirmation page

### Sprint 4 — Admin and inventory (1 week)

- Create admin login and protected admin shell
- Implement product CRUD, inventory adjustments, and bulk import UI
- Add order management and basic status updates

### Sprint 5 — QA, SEO, performance, deployment prep (1 week)

- Add tests, accessibility checks, SEO metadata, analytics, and bug fixes
- Prepare environment variables and deployment config

### Release and post-launch (few days)

- Monitor analytics, fix edge cases, refine admin workflows, and tune performance

---

## 15. Migration checklist: vat-purnima → mruna-designs

- [ ] Rename the repo and package metadata from vat-purnima to mruna-designs
- [ ] Update README, site title, metadata, favicon, and social sharing assets
- [ ] Replace the celebration page with the new storefront shell
- [ ] Rebuild the route structure to match public/admin pages
- [ ] Introduce a shared design system and component library
- [ ] Replace old CSS with Tailwind-based design tokens and responsive utilities
- [ ] Add product catalog data and mapping from any legacy CSV/JSON source
- [ ] Implement cart, checkout, auth, and account flows
- [ ] Add admin CRUD, inventory, and order management experiences
- [ ] Add SEO metadata, structured data, and analytics
- [ ] Run linting, tests, and Lighthouse checks
- [ ] Configure CI and deployment environment variables

---

## 16. Starter code snippets

### ProductCard.tsx

```tsx
import Link from 'next/link';

type ProductCardProps = {
  id: string;
  name: string;
  slug: string;
  category: 'dresses' | 'tshirts' | 'pants';
  price: number;
  image: string;
  rating: number;
};

export function ProductCard({ id, name, slug, category, price, image, rating }: ProductCardProps) {
  return (
    <Link href={`/product/${slug}`} className="group rounded-2xl border p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <img src={image} alt={name} className="h-56 w-full rounded-xl object-cover" />
      <div className="mt-4 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-wide text-gray-500">{category}</p>
          <h3 className="text-lg font-semibold">{name}</h3>
        </div>
        <p className="text-base font-bold">${price.toFixed(2)}</p>
      </div>
      <p className="mt-2 text-sm text-gray-600">★ {rating.toFixed(1)} rating</p>
    </Link>
  );
}
```

### Cart store example

```ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type CartItem = {
  productId: string;
  variantSku: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

type CartState = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  updateQuantity: (variantSku: string, quantity: number) => void;
  removeItem: (variantSku: string) => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const exists = state.items.find((entry) => entry.variantSku === item.variantSku);
          if (exists) {
            return {
              items: state.items.map((entry) =>
                entry.variantSku === item.variantSku ? { ...entry, quantity: entry.quantity + item.quantity } : entry
              ),
            };
          }
          return { items: [...state.items, item] };
        }),
      updateQuantity: (variantSku, quantity) =>
        set((state) => ({
          items: state.items.map((item) => (item.variantSku === variantSku ? { ...item, quantity } : item)),
        })),
      removeItem: (variantSku) =>
        set((state) => ({ items: state.items.filter((item) => item.variantSku !== variantSku) })),
    }),
    { name: 'mruna-designs-cart' }
  )
);
```

### API client with React Query

```ts
import { useQuery } from '@tanstack/react-query';

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  category: 'dresses' | 'tshirts' | 'pants';
};

async function fetchProducts(category?: string): Promise<Product[]> {
  const params = new URLSearchParams();
  if (category) params.set('category', category);
  const res = await fetch(`/api/products?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export function useProducts(category?: string) {
  return useQuery({
    queryKey: ['products', category],
    queryFn: () => fetchProducts(category),
    staleTime: 60_000,
  });
}
```

### Suggested dependencies

```json
{
  "dependencies": {
    "next": "14.x",
    "react": "18.x",
    "react-dom": "18.x",
    "@tanstack/react-query": "^5.x",
    "zustand": "^4.x",
    "react-hook-form": "^7.x",
    "zod": "^3.x",
    "next-auth": "^4.x"
  },
  "devDependencies": {
    "typescript": "^5.x",
    "tailwindcss": "^3.x",
    "eslint": "^9.x",
    "prettier": "^3.x",
    "jest": "^29.x",
    "@testing-library/react": "^16.x",
    "cypress": "^13.x"
  }
}
```

---

## 17. Questions and missing inputs needed to begin

- Repo link and current stack version (Angular, Node, package manager)
- Access to staging backend or mock API endpoints
- Product catalog in CSV or JSON format (minimum 20 products preferred)
- Brand assets: logo, fonts, color palette, imagery, and design tokens
- Preferred payment provider: Stripe, PayPal, or mock-only for phase 1
- Preferred content structure for categories, promos, reviews, and legal pages
- Any required third-party integrations such as analytics, CRM, or email marketing

---

## 18. Immediate next steps

1. Confirm the target stack and repo migration strategy
2. Import or mock the initial product dataset
3. Stand up the new Next.js project structure and shared layout
4. Implement the public storefront shell first, then admin workflows
5. Wire the backend API contracts and add tests as each feature lands
