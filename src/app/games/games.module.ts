import { NgModule }                 from '@angular/core';
import { CommonModule }             from '@angular/common';
import { FormsModule }              from '@angular/forms';
import { GameJoinModalComponent }   from './components/game-join-modal/game-join-modal.component';
import { GamesRoutingModule }       from './games-routing.module';
import { GamesPageComponent }       from './containers/games-page/games-page.component';
import { GameListComponent }        from './components/game-list/game-list.component';
import { GamePageComponent }        from './containers/game-page/game-page.component';
import { GameCreateModalComponent } from './components/game-create-modal/game-create-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    GamesRoutingModule,
  ],
  declarations: [
    GamesPageComponent,
    GameListComponent,
    GamePageComponent,
    GameCreateModalComponent,
    GameJoinModalComponent,
  ],
})
export class GamesModule {}
