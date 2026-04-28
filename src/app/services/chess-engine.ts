import { Injectable, inject } from '@angular/core';
import { Chess, Move as ChessJsMove } from 'chess.js';
import { GameStore, PlayerColor } from '../store/game.store';
import { StockfishService } from './stockfish.service';

@Injectable({
  providedIn: 'root'
})
export class ChessEngineService {
  private chess = new Chess();
  private store = inject(GameStore);
  private stockfish = inject(StockfishService);

  constructor() {
    this.syncState();
  }

  getFen(): string {
    return this.chess.fen();
  }

  getBoard() {
    return this.chess.board();
  }

  getValidMoves(square?: string): string[] {
    // If a square is provided, return moves for that square.
    // If we only want the destination squares for a specific piece:
    if (square) {
      const moves = this.chess.moves({ square: square as any, verbose: true }) as ChessJsMove[];
      return moves.map(m => m.to);
    }
    return this.chess.moves();
  }

  move(from: string, to: string, promotion: string = 'q'): boolean {
    try {
      const move = this.chess.move({ from, to, promotion });
      if (move) {
        this.syncState(move);
        this.checkAiTurn();
        return true;
      }
      return false;
    } catch (e) {
      // Invalid move
      return false;
    }
  }

  undo() {
    this.chess.undo();
    // If AI is enabled, undo twice to go back to player's turn
    if (this.store.isAiEnabled()) {
      this.chess.undo();
    }
    this.syncState();
  }

  reset() {
    this.chess.reset();
    this.store.resetGame(this.chess.fen());
    this.syncState();
  }

  private syncState(lastMoveObj?: ChessJsMove) {
    const history = this.chess.history({ verbose: true }) as ChessJsMove[];
    
    this.store.updateGameState({
      fen: this.chess.fen(),
      turn: this.chess.turn() as PlayerColor,
      isCheck: this.chess.inCheck(),
      isCheckmate: this.chess.isCheckmate(),
      isDraw: this.chess.isDraw(),
      isGameOver: this.chess.isGameOver(),
      history: history.map(m => ({
        san: m.san,
        from: m.from,
        to: m.to,
        piece: m.piece,
        color: m.color as PlayerColor
      })),
      lastMove: lastMoveObj ? { from: lastMoveObj.from, to: lastMoveObj.to } : null
    });
  }

  private checkAiTurn() {
    if (
      this.store.isAiEnabled() && 
      !this.chess.isGameOver() && 
      this.chess.turn() === this.store.aiColor()
    ) {
      // Delay AI move slightly for better UX
      setTimeout(() => this.makeAiMove(), 500);
    }
  }

  private async makeAiMove() {
    const fen = this.chess.fen();
    const level = this.store.aiLevel();
    
    try {
      const bestMoveSan = await this.stockfish.getBestMove(fen, level);
      
      // Stockfish retorna lances no formato UCI (ex: e2e4).
      // A biblioteca chess.js suporta receber objetos {from, to} ou notação SAN.
      // Vamos tentar mover usando a string UCI se for simples, ou convertendo.
      if (bestMoveSan && bestMoveSan.length >= 4) {
        const from = bestMoveSan.substring(0, 2);
        const to = bestMoveSan.substring(2, 4);
        const promotion = bestMoveSan.length > 4 ? bestMoveSan[4] : 'q';
        
        const move = this.chess.move({ from, to, promotion });
        if (move) {
          this.syncState(move);
        }
      } else {
        // Fallback para jogada aleatória se falhar
        this.makeRandomMove();
      }
    } catch (e) {
      console.error('AI Error:', e);
      this.makeRandomMove();
    }
  }

  private makeRandomMove() {
    const moves = this.chess.moves({ verbose: true }) as ChessJsMove[];
    if (moves.length === 0) return;
    const selectedMove = moves[Math.floor(Math.random() * moves.length)];
    this.chess.move(selectedMove.san);
    this.syncState(selectedMove);
  }
}
