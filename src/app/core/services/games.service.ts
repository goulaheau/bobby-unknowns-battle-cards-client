import { Injectable }       from '@angular/core';
import { HttpClient }       from '@angular/common/http';
import { Observable }       from 'rxjs/Observable';
import { Game }             from '../../games/models/game';
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
    private wsService: WebSocketService) {
  }

  connect(game_id: number, user_id: number): WebSocket {
    return this.wsService.connect(`${this.wsUrl}${game_id}/${user_id}/`);
  }

  getAll(): Observable<Game[]> {
    return this.http.get<Game[]>(`${this.url}`);
  }

  get(id: number): Observable<Game> {
    return this.http.get<Game>(`${this.url}${id}/`);
  }

  post(game: Game): Observable<Game> {
    return this.http.post<Game>(this.url, game);
  }

  put(id: number, game: Game): Observable<Game> {
    return this.http.put<Game>(`${this.url}${id}/`, game);
  }

  patch(id: number, game: Game): Observable<Game> {
    return this.http.patch<Game>(`${this.url}${id}/`, game);
  }

  delete(id: number): Observable<Game> {
    return this.http.delete<Game>(`${this.url}${id}/`);
  }
}
