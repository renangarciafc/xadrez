import { signalStore, withState, withMethods, patchState, withComputed } from '@ngrx/signals';
import { computed } from '@angular/core';

export type PlayerColor = 'w' | 'b';

export interface Move {
  san: string;
  from: string;
  to: string;
  piece: string;
  color: PlayerColor;
}

export interface GameState {
  fen: string;
  turn: PlayerColor;
  isCheck: boolean;
  isCheckmate: boolean;
  isDraw: boolean;
  isGameOver: boolean;
  history: Move[];
  isAiEnabled: boolean;
  aiColor: PlayerColor;
  lastMove: { from: string; to: string } | null;
  aiLevel: number; // 1 to 20
  theme: string; // 'glass', 'wood', 'midnight'
  coachMessage: string | null;
  openingName: string | null;
  geminiApiKey: string | null;
}

const initialState: GameState = {
  fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  turn: 'w',
  isCheck: false,
  isCheckmate: false,
  isDraw: false,
  isGameOver: false,
  history: [],
  isAiEnabled: true,
  aiColor: 'b',
  lastMove: null,
  aiLevel: 10, // Padrão: nível 10
  theme: 'glass',
  coachMessage: null,
  openingName: null,
  geminiApiKey: typeof localStorage !== 'undefined' ? localStorage.getItem('geminiApiKey') : null
};

export const GameStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ isCheck, isCheckmate, turn }) => ({
    statusMessage: computed(() => {
      if (isCheckmate()) {
        return `Xeque-mate! As ${turn() === 'w' ? 'Pretas' : 'Brancas'} ganham.`;
      }
      if (isCheck()) {
        return 'Xeque!';
      }
      return `Vez das ${turn() === 'w' ? 'Brancas' : 'Pretas'}`;
    }),
  })),
  withMethods((store) => ({
    updateGameState(newState: Partial<GameState>) {
      patchState(store, newState);
    },
    toggleAi() {
      patchState(store, (state: GameState) => ({ isAiEnabled: !state.isAiEnabled }));
    },
    setAiLevel(level: number) {
      patchState(store, { aiLevel: level });
    },
    setTheme(theme: string) {
      // Aplica a classe no body para refletir no CSS global
      document.body.className = '';
      if (theme !== 'glass') {
        document.body.classList.add(`theme-${theme}`);
      }
      patchState(store, { theme });
    },
    setCoachMessage(msg: string | null) {
      patchState(store, { coachMessage: msg });
    },
    resetGame(fen: string) {
      patchState(store, { ...initialState, fen, isAiEnabled: store.isAiEnabled() });
    },
    updateOpening(openingName: string | null) {
      patchState(store, { openingName });
    },
    setGeminiApiKey(key: string) {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('geminiApiKey', key);
      }
      patchState(store, { geminiApiKey: key });
    }
  }))
);
