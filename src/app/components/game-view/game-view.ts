import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChessboardComponent } from '../chessboard/chessboard';
import { GameControlsComponent } from '../game-controls/game-controls';

@Component({
  selector: 'app-game-view',
  standalone: true,
  imports: [CommonModule, ChessboardComponent, GameControlsComponent],
  styleUrl: './game-view.scss',
  template: `
    <div class="game-layout">
      <div class="board-area">
        <app-chessboard />
      </div>
      <div class="controls-area">
        <app-game-controls />
      </div>
    </div>
  `
})
export class GameViewComponent {}
