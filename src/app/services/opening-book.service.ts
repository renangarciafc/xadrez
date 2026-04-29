import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OpeningBookService {
  
  // Mapeamento simples de sequências de SANs ou Uci
  private openings: Record<string, string> = {
    'e4': 'Abertura do Peão do Rei',
    'd4': 'Abertura do Peão da Rainha',
    'e4 e5': 'Abertura Aberta',
    'e4 e5 Nf3': 'Abertura do Cavalo do Rei',
    'e4 e5 Nf3 Nc6': 'Defesa Clássica',
    'e4 e5 Nf3 Nc6 Bb5': 'Ruy Lopez (Abertura Espanhola)',
    'e4 e5 Nf3 Nc6 Bc4': 'Giuoco Piano (Abertura Italiana)',
    'e4 c5': 'Defesa Siciliana',
    'e4 c6': 'Defesa Caro-Kann',
    'e4 e6': 'Defesa Francesa',
    'd4 d5': 'Abertura Fechada',
    'd4 d5 c4': 'Gambito da Rainha',
    'd4 Nf6': 'Defesa Índia'
  };

  identifyOpening(historySan: string[]): string | null {
    // Pegamos as primeiras 5 jogadas (10 plies) no máximo para identificar a abertura
    const moveSequence = historySan.slice(0, 5).join(' ');
    
    // Tenta achar a sequência exata
    if (this.openings[moveSequence]) {
      return this.openings[moveSequence];
    }
    
    // Fallback: tenta achar o maior match possível (prefixo)
    const possibleMatches = Object.keys(this.openings).filter(key => moveSequence.startsWith(key));
    if (possibleMatches.length > 0) {
      // Ordena por tamanho para pegar a abertura mais profunda conhecida
      possibleMatches.sort((a, b) => b.length - a.length);
      return this.openings[possibleMatches[0]];
    }

    return null;
  }
}
