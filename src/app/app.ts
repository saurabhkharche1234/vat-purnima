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
  messageStep = 0;
  noButtonTop = 20;
  noButtonLeft = 160;
  private audio?: HTMLAudioElement;

  surprise() {
    this.showMessage = true;
    this.messageStep = 1;
    this.resetNoButtonPosition();

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

  sendLove() {
    this.messageStep = 2;
    this.resetNoButtonPosition();
  }

  sayYes() {
    this.messageStep = 3;
    setTimeout(() => {
      this.messageStep = 4;
    }, 2000);
  }

  moveNoButton() {
    if (this.messageStep !== 2) {
      return;
    }

    this.noButtonTop = this.randomInt(0, 90);
    this.noButtonLeft = this.randomInt(0, 220);
  }

  hideMessage() {
    this.showMessage = false;
    this.messageStep = 0;
  }

  private resetNoButtonPosition() {
    this.noButtonTop = 20;
    this.noButtonLeft = 160;
  }

  private randomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
