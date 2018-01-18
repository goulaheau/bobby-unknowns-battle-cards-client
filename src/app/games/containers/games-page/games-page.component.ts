import { HttpParams }                           from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable }                           from 'rxjs/Observable';
import { DecksService }                         from '../../../core/services/decks.service';
import { GamesService }                         from '../../../core/services/games.service';
import { Deck }                                 from '../../../decks/models/deck';
import { Game }                                 from '../../models/game';
import { AuthService }                          from '../../../auth/services/auth.service';
import { Router }                               from '@angular/router';

@Component({
  selector: 'app-games-page',
  templateUrl: './games-page.component.html',
  styleUrls: ['./games-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class GamesPageComponent implements OnInit {
  games$: Observable<Game[]>;
  decks$: Observable<Deck[]>;
  user_id: number;

  constructor(
    private gamesService: GamesService,
    private decksService: DecksService,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit() {
    this.authService
      .current_user()
      .subscribe(
        user => {
          this.user_id = user.id;
          this.decks$  = this.decksService
            .getAll(new HttpParams().set('user', String(this.user_id)));
        },
      );

    this.games$ = this.gamesService.getAll();
  }

  onCreate(data: { deck: number }): void {
    this.gamesService
      .post({
        owner: this.user_id,
        owner_deck: data.deck,
      })
      .subscribe(
        game => {
          this.router.navigate(['/games', game.id]);
        },
      );
  }

  onJoin(game: Game): void {
    for (const property of Object.keys(game)) {
      if (game[property] instanceof Array && game[property].length === 0) {
        delete game[property];
      }
    }

    this.gamesService
      .put(game.id, game)
      .subscribe(
        gameUpdated => {
          this.router.navigate(['/games', gameUpdated.id]);
        }
      );
  }

}
