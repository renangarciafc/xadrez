# ♟️ Modern Chess App 2.0

Uma aplicação de Xadrez moderna, responsiva e esteticamente deslumbrante construída com **Angular 17+** (Signals & Standalone Components) e **NgRx SignalStore**. O projeto traz a potência do motor **Stockfish** rodando nativamente no navegador, integrado a um Treinador de Inteligência Artificial usando o **Google Gemini**.

---

## ✨ Features Principais

*   **🕹️ Modos de Jogo:** Jogue contra um amigo no mesmo dispositivo (Pass & Play) ou contra a Inteligência Artificial.
*   **🧠 Stockfish Engine:** Integração com o motor profissional `stockfish.js` rodando em um Web Worker para não travar a interface. Dificuldade escalável através de um slider (Nível 1 a 20).
*   **🎨 Sistema de Temas Dinâmico:** Troque o visual do jogo instantaneamente sem recarregar a página. Temas inclusos:
    *   *Neon Glass* (Padrão cibernético com Glassmorphism)
    *   *Madeira Clássica* (Tons orgânicos e tradicionais)
    *   *Meia-Noite* (Tons escuros e roxos no estilo Dracula)
*   **🤖 Treinador IA Sarcástico (Gemini API):** Se você cometer um Erro Crasso (Blunder) ou fizer um Lance Brilhante, o treinador comentará o lance em linguagem natural. (Configurável via chave de API na UI).
*   **📚 Livro de Aberturas:** O jogo identifica e exibe o nome de aberturas clássicas (ex: *Defesa Siciliana*, *Ruy Lopez*) durante as primeiras rodadas.
*   **🔄 Controles Completos:** Voltar jogada (Undo), Histórico de Lances, Detecção de Xeque/Mate e Reinício Rápido.

---

## 🚀 Como Executar Localmente

### Pré-requisitos
*   [Node.js](https://nodejs.org/) (Versão 18+ recomendada)
*   Angular CLI (`npm install -g @angular/cli`)

### Instalação
1. Clone o repositório:
   ```bash
   git clone <sua-url-do-github>
   cd xadrez
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm start
   ```
4. Abra o navegador em `http://localhost:4200`.

---

## 🔑 Configurando o Treinador IA (Google Gemini)

O Treinador Inteligente analisa matematicamente seus erros usando o Stockfish e gera broncas verbais usando a API do **Google Gemini**. 
Para ativar o treinador inteligente:

1. Gere uma chave de API gratuita no [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Abra o jogo (`http://localhost:4200/menu`).
3. Cole a sua chave no campo **Treinador IA**.
4. Inicie a partida!

> **Nota de Segurança:** Sua chave de API é salva apenas no `localStorage` do seu navegador. Ela **nunca** é escrita no código-fonte, garantindo que você possa fazer forks e commits no GitHub sem o risco de vazar suas credenciais!

---

## 🛠️ Tecnologias Utilizadas

*   **Frontend:** Angular 17+ (Signals, Standalone Components, Router)
*   **Gerenciamento de Estado:** `@ngrx/signals` (SignalStore)
*   **Lógica de Xadrez:** `chess.js` (Validação de lances, geração de FEN)
*   **Motor (Engine):** `stockfish.js` via Web Workers
*   **Estilização:** SCSS (CSS Custom Properties para temas)
*   **LLM:** Integração REST direta com Google Gemini 2.5 Flash

---

Feito com 💙 para a comunidade de xadrez!
