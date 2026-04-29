import { Routes } from '@angular/router';
import { MainMenuComponent } from './components/main-menu/main-menu';
import { GameViewComponent } from './components/game-view/game-view';

export const routes: Routes = [
  { path: '', redirectTo: '/menu', pathMatch: 'full' },
  { path: 'menu', component: MainMenuComponent },
  { path: 'play', component: GameViewComponent },
  { path: '**', redirectTo: '/menu' }
];
