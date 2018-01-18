import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';

import { GamesService }   from '../../../core/services/games.service';
import { ActivatedRoute } from '@angular/router';
import { User }           from '../../../auth/models/user';
import { AuthService }    from '../../../auth/services/auth.service';
import { Game }           from '../../models/game';

@Component({
  selector: 'app-game-page',
  templateUrl: './game-page.component.html',
  styleUrls: ['./game-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class GamePageComponent implements OnInit, OnDestroy {
  socket: WebSocket;
  game: Game;
  game_id: number;
  user: User;

  constructor(
    private route: ActivatedRoute,
    private gamesService: GamesService,
    private authService: AuthService) {
  }

  ngOnInit() {
    this.authService.current_user().subscribe(
      user => {
        this.user = user;
        this.route.params.subscribe(params => {
          this.game_id = +params['id'];

          if (this.game_id) {
            this.socket           = this.gamesService.connect(this.game_id, this.user.id);
            this.socket.onmessage = this.onMessage.bind(this);

            setTimeout(() => {
              this.gamesService.get(this.game_id).subscribe(
                game => {
                  this.game = game;

                  if (this.game.player_turn === null
                    && this.game.opponent === this.user.id
                  ) {
                    this.socket.send(JSON.stringify({
                      action: 'init',
                      payload: {},
                    }));
                  }
                },
              );
            });
          }
        });
      },
    );
  }

  send(): void {

  }

  onMessage(messageEvent: MessageEvent) {
    const message: {
      action: string,
      payload: any
    } = JSON.parse(messageEvent.data);

    switch (message.action) {
      case 'init':
        this.gamesService.get(this.game_id).subscribe(
          game => {
            this.game = game;
          },
        );
        break;
    }
  }

  ngOnDestroy(): void {
    this.socket.close();
  }
}
