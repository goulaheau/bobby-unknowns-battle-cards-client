import { Injectable }       from '@angular/core';
import { HttpClient }       from '@angular/common/http';
import { Observable }       from 'rxjs/Observable';
import { Game }             from '../../games/models/game';
import { CardsService }     from './cards.service';
import { UsersService }     from './users.service';
import { WebSocketService } from './web-socket.service';
import { Subject }          from 'rxjs/Subject';

@Injectable()
export class GamesService {
  private url   = 'http://localhost:8000/games/';
  private wsUrl = 'ws://localhost:8000/games/';

  constructor(
    private http: HttpClient,
    private usersService: UsersService,
    private cardsService: CardsService,
    private wsService: WebSocketService) {
  }

  connect(game_id: number, user_id: number): WebSocket {
    return this.wsService.connect(`${this.wsUrl}${game_id}/${user_id}/`);
  }

  getAll(): Observable<Game[]> {
    return this.http.get<Game[]>(`${this.url}`);
  }

  get(id: number): Observable<Game> {
    return this.http
      .get<Game>(`${this.url}${id}/`)
      .do(
        (game: Game) => {
          if (game.owner) {
            this.usersService.get(game.owner).subscribe(
              owner => game.owner = owner,
            );
          }
          if (game.opponent) {
            this.usersService.get(game.opponent).subscribe(
              opponent => game.opponent = opponent,
            );
          }

          this.cardsService.getAll().subscribe(
            (cards: any) => {
              // Create an object with the ids as keys.
              cards = cards.reduce((map, obj) => {
                map[obj.id] = obj;
                return map;
              }, {});

              for (const i in game.owner_deck_cards) {
                game.owner_deck_cards[i] = cards[game.owner_deck_cards[i]];
              }
              for (const i in game.opponent_deck_cards) {
                game.opponent_deck_cards[i] = cards[game.opponent_deck_cards[i]];
              }
              for (const i in game.owner_hand_cards) {
                game.owner_hand_cards[i] = cards[game.owner_hand_cards[i]];
              }
              for (const i in game.opponent_hand_cards) {
                game.opponent_hand_cards[i] = cards[game.opponent_hand_cards[i]];
              }
              for (const i in game.owner_board_cards) {
                game.owner_board_cards[i] = cards[game.owner_board_cards[i]];
              }
              for (const i in game.opponent_board_cards) {
                game.opponent_board_cards[i] = cards[game.opponent_board_cards[i]];
              }
              for (const i in game.owner_graveyard_cards) {
                game.owner_graveyard_cards[i] = cards[game.owner_graveyard_cards[i]];
              }
              for (const i in game.opponent_graveyard_cards) {
                game.opponent_graveyard_cards[i] = cards[game.opponent_graveyard_cards[i]];
              }
            },
          );
        },
      );
  }

  post(game: Game): Observable<Game> {
    this.removeEmptyArrays(game);
    return this.http.post<Game>(this.url, game);
  }

  put(id: number, game: Game): Observable<Game> {
    this.removeEmptyArrays(game);
    return this.http.put<Game>(`${this.url}${id}/`, game);
  }

  patch(id: number, game: Game): Observable<Game> {
    return this.http.patch<Game>(`${this.url}${id}/`, game);
  }

  delete(id: number): Observable<Game> {
    return this.http.delete<Game>(`${this.url}${id}/`);
  }

  removeEmptyArrays(obj): void {
    for (const property of Object.keys(obj)) {
      if (obj[property] instanceof Array && obj[property].length === 0) {
        delete obj[property];
      }
    }
  }
}
