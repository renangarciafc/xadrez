import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameStore } from '../../store/game.store';
import { ChessEngineService } from '../../services/chess-engine';

@Component({
  selector: 'app-game-controls',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-controls.html',
  styleUrl: './game-controls.scss'
})
export class GameControlsComponent {
  public store = inject(GameStore);
  private engine = inject(ChessEngineService);

  onUndo() {
    this.engine.undo();
  }

  onReset() {
    this.engine.reset();
  }

  onToggleAi() {
    this.store.toggleAi();
  }

  onLevelChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.store.setAiLevel(parseInt(input.value, 10));
  }
}
