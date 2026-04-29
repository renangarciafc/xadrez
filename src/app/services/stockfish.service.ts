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

  evaluatePosition(fen: string, depth = 10): Promise<number> {
    return new Promise((resolve, reject) => {
      if (!this.worker) {
        reject('Worker not initialized');
        return;
      }

      this.worker.postMessage('ucinewgame');
      this.worker.postMessage(`position fen ${fen}`);
      this.worker.postMessage(`go depth ${depth}`);

      let lastCp = 0;

      const listener = (event: MessageEvent) => {
        const message: string = event.data;

        // Exemplo: "info depth 10 seldepth 14 multipv 1 score cp 45 nodes 1234..."
        if (message.includes('score cp')) {
          const match = message.match(/score cp (-?\d+)/);
          if (match && match[1]) {
            lastCp = parseInt(match[1], 10);
          }
        } else if (message.includes('score mate')) {
          const match = message.match(/score mate (-?\d+)/);
          if (match && match[1]) {
            const mateIn = parseInt(match[1], 10);
            // Pontuações massivas para mates: mate 1 = 10000, mate -1 = -10000
            lastCp = mateIn > 0 ? 10000 - mateIn : -10000 - mateIn;
          }
        }

        if (message.startsWith('bestmove')) {
          this.worker?.removeEventListener('message', listener);
          resolve(lastCp);
        }
      };

      this.worker.addEventListener('message', listener);
    });
  }
}
