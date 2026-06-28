import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('vat-purnima');
  showMessage = false;

  surprise() {
    this.showMessage = true;

    const audio = new Audio("assets/music.mp3");
    audio.play();
  }

}
