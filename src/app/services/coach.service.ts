import { Injectable, inject } from '@angular/core';
import { StockfishService } from './stockfish.service';
import { GameStore } from '../store/game.store';

@Injectable({
  providedIn: 'root'
})
export class CoachService {
  private stockfish = inject(StockfishService);
  private store = inject(GameStore);
  private lastAbsoluteScore = 0;

  async analyzeMove(fen: string, playerColorMoved: 'w' | 'b', lastMoveSan: string): Promise<string | null> {
    const currentScore = await this.stockfish.evaluatePosition(fen, 10);

    const isWhiteToMoveNow = fen.includes(' w ');

    const currentAbsoluteScore = isWhiteToMoveNow ? currentScore : -currentScore;

    // Calcula a diferença da perspectiva de quem ACABOU de jogar
    let diff = 0;
    if (playerColorMoved === 'w') {
      diff = currentAbsoluteScore - this.lastAbsoluteScore; // Positivo significa que Brancas melhoraram
    } else {
      diff = this.lastAbsoluteScore - currentAbsoluteScore; // Positivo significa que Pretas melhoraram
    }

    this.lastAbsoluteScore = currentAbsoluteScore;

    // Se a diferença for muito negativa (perdeu mais de 200 centipawns / 2 peões), é um Erro Crasso (Blunder)
    if (diff < -200) {
      return this.generateCoachMessage(fen, lastMoveSan, 'blunder');
    }

    // Se ganhou muita vantagem (lance brilhante)
    if (diff > 300) {
      return this.generateCoachMessage(fen, lastMoveSan, 'brilliant');
    }

    return null; // Lance normal, não diz nada
  }

  private async generateCoachMessage(fen: string, move: string, type: 'blunder' | 'brilliant'): Promise<string> {
    const apiKey = this.store.geminiApiKey();
    if (!apiKey) {
      // Fallback offline se não tiver API key configurada
      if (type === 'blunder') return `Ops! O lance ${move} foi um Erro Crasso segundo o Stockfish!`;
      return `Excelente! ${move} foi um lance brilhante!`;
    }

    try {
      const prompt = `Você é um treinador de xadrez sarcástico mas prestativo. O jogador acabou de fazer o lance ${move}. 
      A avaliação do Stockfish diz que esse lance foi um ${type === 'blunder' ? 'ERRO GRAVE (Blunder)' : 'LANCE BRILHANTE'}.
      Comente sobre esse lance em no máximo 2 frases curtas. Não me dê o FEN de volta, apenas a sua reação verbal direta ao jogador em português BR.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      const data = await response.json();
      if (data.candidates && data.candidates.length > 0) {
        console.log(data.candidates[0].content.parts[0].text);
        return data.candidates[0].content.parts[0].text;
      }
    } catch (e) {
      console.error('Gemini API Error:', e);
    }

    // Fallback on error
    return type === 'blunder' ? 'Isso foi um erro crasso!' : 'Belo lance!';
  }

  reset() {
    this.lastAbsoluteScore = 0;
  }
}
