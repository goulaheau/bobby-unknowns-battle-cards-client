import { HttpParams }                           from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router }                               from '@angular/router';
import { Observable }                           from 'rxjs/Observable';
import { DecksService }                         from '../../../core/services/decks.service';
import { GamesService }                         from '../../../core/services/games.service';
import { RulesService }                         from '../../../core/services/rules.service';
import { Deck }                                 from '../../../decks/models/deck';
import { Game }                                 from '../../models/game';
import { AuthService }                          from '../../../auth/services/auth.service';
import { Rule }                                 from '../../models/rule';

@Component({
  selector: 'app-games-page',
  templateUrl: './games-page.component.html',
  styleUrls: ['./games-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class GamesPageComponent implements OnInit {
  games$: Observable<Game[]>;
  decks: Deck[];
  rules$: Observable<Rule[]>;
  user_id: number;

  constructor(
    private gamesService: GamesService,
    private rulesService: RulesService,
    private decksService: DecksService,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit() {
    this.authService
      .current_user()
      .subscribe(
        user => {
          this.user_id = user.id;
          this.decksService
            .getAll()
            .subscribe(
              decks => this.decks = decks.filter(
                deck => deck.user === null || deck.user === this.user_id
              )
            );
        },
      );

    this.games$ = this.gamesService.getAll();
    this.rules$ = this.rulesService.getAll();
  }

  onCreate(data: { deck: number, rule: number }): void {
    this.gamesService
      .post({
        rule: data.rule,
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
    this.gamesService
      .put(game.id, game)
      .subscribe(
        gameUpdated => {
          this.router.navigate(['/games', gameUpdated.id]);
        }
      );
  }

}
