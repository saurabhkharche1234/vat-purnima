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
  private audio?: HTMLAudioElement;

  surprise() {
    this.showMessage = true;

    if (typeof Audio === 'undefined') {
      return;
    }

    if (!this.audio) {
      this.audio = new Audio('assets/music.mp3');
    }

    if (this.audio.paused) {
      this.audio.currentTime = 0;
      this.audio.play().catch(() => {
        // ignore playback errors if the browser blocks autoplay
      });
    }
  }

  hideMessage() {
    this.showMessage = false;
  }
}
