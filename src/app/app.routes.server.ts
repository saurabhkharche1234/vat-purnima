import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'category/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => [
      { slug: 'dresses' },
      { slug: 'tshirts' },
      { slug: 'pants' }
    ]
  },
  {
    path: 'product/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => [
      { slug: 'aurora-midi-dress' },
      { slug: 'studio-tee' },
      { slug: 'contour-wide-leg-pants' },
      { slug: 'nora-linen-dress' },
      { slug: 'riven-oversized-tee' },
      { slug: 'mila-tailored-pants' }
    ]
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
