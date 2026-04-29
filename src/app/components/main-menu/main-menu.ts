import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GameStore } from '../../store/game.store';

@Component({
  selector: 'app-main-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './main-menu.html',
  styleUrl: './main-menu.scss'
})
export class MainMenuComponent {
  store = inject(GameStore);
  private router = inject(Router);

  themes = [
    { id: 'glass', name: 'Neon Glass' },
    { id: 'wood', name: 'Madeira Clássica' },
    { id: 'midnight', name: 'Meia-Noite' }
  ];

  setTheme(themeId: string) {
    this.store.setTheme(themeId);
  }

  toggleAi() {
    this.store.toggleAi();
  }

  setAiLevel(event: Event) {
    const input = event.target as HTMLInputElement;
    this.store.setAiLevel(parseInt(input.value, 10));
  }

  setApiKey(event: Event) {
    const input = event.target as HTMLInputElement;
    this.store.setGeminiApiKey(input.value.trim());
  }

  startGame() {
    this.router.navigate(['/play']);
  }
}
