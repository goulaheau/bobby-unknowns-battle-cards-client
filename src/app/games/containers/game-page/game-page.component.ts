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
            this.socket.onopen    = this.initGame.bind(this);
            this.socket.onmessage = this.onMessage.bind(this);
          }
        });
      },
    );
  }

  initGame(): void {
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
  }

  getGame(): void {
    this.gamesService.get(this.game_id).subscribe(
      game => {
        this.game = game;
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
        this.getGame();
        break;
      case 'play_card':
        this.actionPlayCard(message);
        break;
    }
  }

  actionPlayCard(message: { action: string, payload: any }): void {
    if (this.user.id === message.payload.emitter) {
      if (!message.payload.success) {
        this.getGame();
      }
    } else {
      if (message.payload.success) {
        let card_to_play = null;
        if (this.user.id === this.game.owner.id) {
          this.game.opponent_hand_cards.forEach(card => {
            if (card.id === message.payload.card_to_play) {
              card_to_play = card;
            }
          });
          if (card_to_play) {
            this.game.opponent_hand_cards  = this.game.opponent_hand_cards.filter(
              card => card !== card_to_play,
            );
            const card_values_to_play = {
              user: message.payload.emitter,
              card: card_to_play,
              health: card_to_play.health,
              strengh: card_to_play.strengh,
            };
            this.game.opponent_board_cards = [
              ...this.game.opponent_board_cards,
              card_values_to_play,
            ];
          } else {
            this.getGame();
          }
        } else {
          this.game.owner_hand_cards.forEach(card => {
            if (card.id === message.payload.card_to_play) {
              card_to_play = card;
            }
          });
          if (card_to_play) {
            this.game.owner_hand_cards  = this.game.owner_hand_cards.filter(
              card => card !== card_to_play,
            );
            const card_values_to_play = {
              user: message.payload.emitter,
              card: card_to_play,
              health: card_to_play.health,
              strengh: card_to_play.strengh,
            };
            this.game.owner_board_cards = [
              ...this.game.owner_board_cards,
              card_values_to_play,
            ];
          } else {
            this.getGame();
          }
        }
      }
    }
  }

  dragStart(event, card: Card) {
    this.draggedCard = card;
  }

  drop() {
    if (this.draggedCard) {
      const draggedCardIndex = this.findIndex(this.draggedCard);
      const draggedCardValues = {
        user: this.user.id,
        card: this.draggedCard,
        health: this.draggedCard.health,
        strengh: this.draggedCard.strengh,
      };

      if (this.user.id === this.game.owner.id) {
        this.game.owner_hand_cards  = this.game.owner_hand_cards.filter((val, i) => i !== draggedCardIndex);
        this.game.owner_board_cards = [...this.game.owner_board_cards, draggedCardValues];
        this.sendMessage('play_card', { card_to_play: this.draggedCard.id });
      } else {
        this.game.opponent_hand_cards  = this.game.opponent_hand_cards.filter((val, i) => i !== draggedCardIndex);
        this.game.opponent_board_cards = [...this.game.opponent_board_cards, draggedCardValues];
        this.sendMessage('play_card', { card_to_play: this.draggedCard.id });
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
