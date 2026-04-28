import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StockfishService {
  private worker: Worker | null = null;
  private isReady = false;

  constructor() {
    this.initWorker();
  }

  private initWorker() {
    try {
      // The stockfish.js file must be available in the public folder.
      this.worker = new Worker('stockfish.js');
      
      this.worker.onmessage = (event) => {
        if (event.data === 'uciok') {
          this.isReady = true;
        }
      };

      this.worker.postMessage('uci');
    } catch (e) {
      console.error('Failed to load Stockfish worker:', e);
    }
  }

  getBestMove(fen: string, level: number): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.worker) {
        reject('Worker not initialized');
        return;
      }

      // Configure Skill Level (0-20)
      this.worker.postMessage(`setoption name Skill Level value ${level}`);
      this.worker.postMessage('ucinewgame');
      this.worker.postMessage(`position fen ${fen}`);
      
      // We limit depth based on level so it responds reasonably fast
      // Level 1-5: depth 5, Level 6-10: depth 10, Level 11-15: depth 15, Level 16-20: depth 20
      const depth = Math.max(1, Math.min(20, Math.ceil(level)));
      this.worker.postMessage(`go depth ${depth}`);

      const listener = (event: MessageEvent) => {
        const message: string = event.data;
        if (message.startsWith('bestmove')) {
          this.worker?.removeEventListener('message', listener);
          // bestmove format: "bestmove e2e4 ponder e7e5"
          const move = message.split(' ')[1];
          resolve(move);
        }
      };

      this.worker.addEventListener('message', listener);
    });
  }
}
