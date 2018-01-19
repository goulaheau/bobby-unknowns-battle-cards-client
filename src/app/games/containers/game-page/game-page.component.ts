import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';

import { GamesService }   from '../../../core/services/games.service';
import { ActivatedRoute } from '@angular/router';
import { User }           from '../../../auth/models/user';
import { AuthService }    from '../../../auth/services/auth.service';
import { Card }           from '../../../decks/models/card';
import { Game }           from '../../models/game';

@Component({
  selector: 'app-game-page',
  templateUrl: './game-page.component.html',
  styleUrls: ['./game-page.component.scss'],
})
export class GamePageComponent implements OnInit, OnDestroy {
  socket: WebSocket;
  game: Game;
  game_id: number;
  user: User;
  draggedCard: Card | null;

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
                    this.sendMessage('init');
                  }
                },
              );
            });
          }
        });
      },
    );
  }

  sendMessage(action: string, payload: any = null): void {
    this.socket.send(JSON.stringify({ action, payload }));
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

  dragStart(event, card: Card) {
    this.draggedCard = card;
  }

  drop(event) {
    if (this.draggedCard) {
      const draggedCardIndex = this.findIndex(this.draggedCard);

      if (this.user.id === this.game.owner.id) {
        this.game.owner_board_cards = [...this.game.owner_board_cards, this.draggedCard];
        this.game.owner_hand_cards  = this.game.owner_hand_cards.filter((val, i) => i !== draggedCardIndex);
        this.sendMessage('play_card', { card_to_play: this.draggedCard });
      } else {
        this.game.opponent_board_cards = [...this.game.opponent_board_cards, this.draggedCard];
        this.game.opponent_hand_cards  = this.game.opponent_hand_cards.filter((val, i) => i !== draggedCardIndex);
        this.sendMessage('play_card', { card_to_play: this.draggedCard });
      }

      this.draggedCard = null;
    }
  }

  dragEnd(event) {
    this.draggedCard = null;
  }

  findIndex(card: Card) {
    let index = -1;

    if (this.user.id === this.game.owner.id) {
      for (let i = 0; i < this.game.owner_hand_cards.length; i++) {
        if (card.id === this.game.owner_hand_cards[i].id) {
          index = i;
          break;
        }
      }
    } else {
      for (let i = 0; i < this.game.opponent_hand_cards.length; i++) {
        if (card.id === this.game.opponent_hand_cards[i].id) {
          index = i;
          break;
        }
      }
    }

    return index;
  }

  ngOnDestroy(): void {
    this.socket.close();
  }
}
