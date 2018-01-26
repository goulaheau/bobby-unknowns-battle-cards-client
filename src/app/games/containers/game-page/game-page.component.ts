import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute }               from '@angular/router';
import { Message }                      from '../../../core/models/message';
import { GamesService }                 from '../../../core/services/games.service';
import { User }                         from '../../../auth/models/user';
import { AuthService }                  from '../../../auth/services/auth.service';
import { Card }                         from '../../../decks/models/card';
import { CardValue }                    from '../../models/card-value';
import { Game }                         from '../../models/game';

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
  cardToPlay: Card | null;
  attacker: CardValue | null;

  constructor(
    private route: ActivatedRoute,
    private gamesService: GamesService,
    private authService: AuthService) {
  }

  ngOnInit(): void {
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

  getGame(): void {
    this.gamesService.get(this.game_id).subscribe(
      game => {
        this.game = game;
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
          this.sendMessage({ action: 'init', payload: null });
        }
      },
    );
  }

  sendMessage(message: Message): void {
    this.socket.send(JSON.stringify(message));
  }

  onMessage(messageEvent: MessageEvent): void {
    const message: Message = JSON.parse(messageEvent.data);

    console.log(message.payload.success, message);

    if (this.user.id === message.payload.emitter
      && message.action !== 'end_turn') {
      if (!message.payload.success) {
        this.getGame();
      }
    } else if (message.payload.success) {
      switch (message.action) {
        case 'init':
          this.getGame();
          break;
        case 'play_card':
          this.actionPlayCard(message);
          break;
        case 'attack':
          this.actionAttack(message);
          break;
        case 'end_turn':
          this.actionEndTurn(message);
          break;
      }
    }
  }

  // Card to play
  canPlayCard(card: Card): boolean {
    if (this.user.id === this.game.player_turn) {
      if (this.user.id === this.game.owner.id) {
        return card.cost <= this.game.owner_mana;
      } else {
        return card.cost <= this.game.opponent_mana;
      }
    } else {
      return false;
    }
  }

  dragCardToPlay(cardToPlay: Card): void {
    this.cardToPlay = cardToPlay;
  }

  dropCardToPlay(): void {
    if (this.cardToPlay) {
      this.actionPlayCard({
        action: 'play_card',
        payload: {
          emitter: this.user.id,
          card_to_play: this.cardToPlay.id,
        },
      });

      this.sendMessage({
        action: 'play_card',
        payload: {
          card_to_play: this.cardToPlay.id,
        },
      });

      this.cardToPlay = null;
    }
  }

  actionPlayCard(message: Message): void {
    let card_to_play = null;
    if (message.payload.emitter === this.game.owner.id) {
      this.game.owner_hand_cards.forEach(card => {
        if (card.id === message.payload.card_to_play) {
          card_to_play = card;
        }
      });
      if (card_to_play) {
        this.game.owner_mana -= card_to_play.cost;

        this.game.owner_hand_cards = this.game.owner_hand_cards.filter(
          card => card !== card_to_play,
        );

        const card_value_to_play = {
          user: message.payload.emitter,
          card: card_to_play,
          health: card_to_play.health,
          strength: card_to_play.strength,
          can_attack: false,
        };

        this.game.owner_board_card_values = [
          ...this.game.owner_board_card_values,
          card_value_to_play,
        ];
      } else {
        this.getGame();
      }
    } else {
      this.game.opponent_hand_cards.forEach(card => {
        if (card.id === message.payload.card_to_play) {
          card_to_play = card;
        }
      });
      if (card_to_play) {
        this.game.opponent_mana -= card_to_play.cost;

        this.game.opponent_hand_cards = this.game.opponent_hand_cards.filter(
          card => card !== card_to_play,
        );

        const card_value_to_play = {
          user: message.payload.emitter,
          card: card_to_play,
          health: card_to_play.health,
          strength: card_to_play.strength,
          can_attack: false,
        };

        this.game.opponent_board_card_values = [
          ...this.game.opponent_board_card_values,
          card_value_to_play,
        ];
      } else {
        this.getGame();
      }
    }
  }

  // Attack
  dragAttacker(attacker: CardValue): void {
    this.attacker = attacker;
  }

  dropAttacker(victim: CardValue): void {
    if (this.attacker) {
      this.actionAttack({
        action: 'attack',
        payload: {
          emitter: this.user.id,
          attacker: this.attacker.card.id,
          victim: victim.card.id,
        },
      });

      this.sendMessage({
        action: 'attack',
        payload: {
          attacker: this.attacker.card.id,
          victim: victim.card.id,
        },
      });

      this.attacker = null;
    }
  }

  actionAttack(message: Message): void {
    let attacker = null;
    let victim   = null;
    if (message.payload.emitter === this.game.owner.id) {
      this.game.owner_board_card_values.forEach(cardValues => {
        if (cardValues.card.id === message.payload.attacker) {
          attacker = cardValues;
        }
      });

      this.game.opponent_board_card_values.forEach(cardValues => {
        if (cardValues.card.id === message.payload.victim) {
          victim = cardValues;
        }
      });

      if (attacker && victim) {
        victim.health -= attacker.strength;
        attacker.health -= victim.strength;
        attacker.can_attack = false;

        if (attacker.health <= 0) {
          this.game.owner_board_card_values = this.game.owner_board_card_values.filter(
            cardValue => cardValue.card.id !== attacker.card.id,
          );

          this.game.owner_graveyard_cards = [...this.game.owner_graveyard_cards, attacker.card];
        }
        if (victim.health <= 0) {
          this.game.opponent_board_card_values = this.game.opponent_board_card_values.filter(
            cardValue => cardValue.card.id !== victim.card.id,
          );

          this.game.opponent_graveyard_cards = [...this.game.opponent_graveyard_cards, victim.card];
        }
      } else {
        this.getGame();
      }
    } else {
      this.game.opponent_board_card_values.forEach(cardValues => {
        if (cardValues.card.id === message.payload.attacker) {
          attacker = cardValues;
        }
      });

      this.game.owner_board_card_values.forEach(cardValues => {
        if (cardValues.card.id === message.payload.victim) {
          victim = cardValues;
        }
      });

      if (attacker && victim) {
        victim.health -= attacker.strength;
        attacker.health -= victim.strength;
        attacker.can_attack = false;

        if (attacker.health <= 0) {
          this.game.opponent_board_card_values = this.game.opponent_board_card_values.filter(
            cardValue => cardValue.card.id !== attacker.card.id,
          );

          this.game.opponent_graveyard_cards = [...this.game.opponent_graveyard_cards, attacker.card];
        }
        if (victim.health <= 0) {
          this.game.owner_board_card_values = this.game.owner_board_card_values.filter(
            cardValue => cardValue.card.id !== victim.card.id,
          );

          this.game.owner_graveyard_cards = [...this.game.owner_graveyard_cards, victim.card];
        }
      } else {
        this.getGame();
      }
    }
  }

  // End turn
  endTurn(): void {
    this.sendMessage({
      action: 'end_turn',
      payload: null,
    });
  }

  actionEndTurn(message: Message): void {
    this.game.turn += 1;
    if (message.payload.emitter === this.game.owner.id) {
      this.game.player_turn   = this.game.opponent.id;
      this.game.opponent_mana = Math.ceil(this.game.turn / 2);

      this.game.opponent_board_card_values.forEach(
        cardValue => cardValue.can_attack = true,
      );

      this.game.opponent_hand_cards = [
        ...this.game.opponent_hand_cards,
        message.payload.card_draw,
      ];
    } else {
      this.game.player_turn = this.game.owner.id;
      this.game.owner_mana  = Math.ceil(this.game.turn / 2);

      this.game.owner_board_card_values.forEach(
        cardValue => cardValue.can_attack = true,
      );

      this.game.owner_hand_cards = [
        ...this.game.owner_hand_cards,
        message.payload.card_draw,
      ];
    }
  }

  ngOnDestroy(): void {
    this.socket.close();
  }
}
