import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="footer">
      <div>
        <h4>mruna designs</h4>
        <p>Elevated staples for thoughtful dressing.</p>
      </div>
      <div class="footer-links">
        <a href="#">About</a>
        <a href="#">Contact</a>
        <a href="#">Terms</a>
      </div>
    </footer>
  `,
  styles: [
    `:host { display:block; }`,
    `.footer { margin-top:2rem; padding:2rem 1.25rem; border-top:1px solid #ece6df; display:flex; justify-content:space-between; gap:1rem; background:#fffdf9; }`,
    `.footer h4 { margin:0 0 0.25rem; text-transform:uppercase; letter-spacing:0.15em; }`,
    `.footer-links { display:flex; gap:1rem; flex-wrap:wrap; }`,
    `.footer-links a { color:#5f4f3d; text-decoration:none; }`,
    `@media (max-width: 760px) { .footer { flex-direction:column; } }`
  ]
})
export class FooterComponent {}
