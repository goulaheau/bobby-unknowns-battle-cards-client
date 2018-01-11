import { NgModule }               from '@angular/core';
import { CommonModule }           from '@angular/common';
import { FormsModule }            from '@angular/forms';
import { GamesRoutingModule }     from './games-routing.module';
import { GamesPageComponent }     from './containers/games-page/games-page.component';
import { GameListComponent }      from './components/game-list/game-list.component';
import { GamePageComponent }      from './containers/game-page/game-page.component';
import { GameFormModalComponent } from './components/game-form-modal/game-form-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    GamesRoutingModule
  ],
  declarations: [
    GamesPageComponent,
    GameListComponent,
    GamePageComponent,
    GameFormModalComponent
  ]
})
export class GamesModule { }
