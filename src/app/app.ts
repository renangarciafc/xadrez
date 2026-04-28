import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChessboardComponent } from './components/chessboard/chessboard';
import { GameControlsComponent } from './components/game-controls/game-controls';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ChessboardComponent, GameControlsComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class AppComponent {
  title = 'chess-app';
}
