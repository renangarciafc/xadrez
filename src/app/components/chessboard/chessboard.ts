import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChessEngineService } from '../../services/chess-engine';
import { GameStore } from '../../store/game.store';
import { CHESS_PIECES } from '../../utils/chess-pieces';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-chessboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chessboard.html',
  styleUrl: './chessboard.scss'
})
export class ChessboardComponent {
  private engine = inject(ChessEngineService);
  public store = inject(GameStore);
  private sanitizer = inject(DomSanitizer);

  // Derive the board from the FEN in the store
  board = computed(() => {
    this.store.fen(); // trigger reactivity on fen change
    return this.engine.getBoard();
  });

  selectedSquare = signal<string | null>(null);
  validMoves = signal<string[]>([]);

  readonly files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

  getSquareName(rowIndex: number, colIndex: number): string {
    const rank = 8 - rowIndex;
    const file = this.files[colIndex];
    return `${file}${rank}`;
  }

  isDarkSquare(rowIndex: number, colIndex: number): boolean {
    return (rowIndex + colIndex) % 2 !== 0;
  }

  getPieceSvg(piece: { color: string; type: string } | null): SafeHtml | null {
    if (!piece) return null;
    const key = `${piece.color}-${piece.type}`;
    const svg = CHESS_PIECES[key];
    return svg ? this.sanitizer.bypassSecurityTrustHtml(svg) : null;
  }

  onSquareClick(square: string) {
    if (this.store.isGameOver() || (this.store.isAiEnabled() && this.store.turn() === this.store.aiColor())) {
      return; // Do nothing if game is over or it's AI's turn
    }

    const currentSelected = this.selectedSquare();

    // If already selected, try to move
    if (currentSelected) {
      if (this.validMoves().includes(square)) {
        // Move! (Assuming auto queen promotion for simplicity in UI)
        const success = this.engine.move(currentSelected, square, 'q');
        this.selectedSquare.set(null);
        this.validMoves.set([]);
        return;
      }

      // If clicked the same square, deselect
      if (currentSelected === square) {
        this.selectedSquare.set(null);
        this.validMoves.set([]);
        return;
      }
    }

    // Try to select the piece
    const moves = this.engine.getValidMoves(square);
    if (moves.length > 0) {
      this.selectedSquare.set(square);
      this.validMoves.set(moves);
    } else {
      this.selectedSquare.set(null);
      this.validMoves.set([]);
    }
  }

  isHighlight(square: string): boolean {
    return this.validMoves().includes(square);
  }

  isSelected(square: string): boolean {
    return this.selectedSquare() === square;
  }

  isLastMove(square: string): boolean {
    const last = this.store.lastMove();
    if (!last) return false;
    return last.from === square || last.to === square;
  }
}
