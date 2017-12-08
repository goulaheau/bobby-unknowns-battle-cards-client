import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Deck } from '../../decks/models/deck';

@Injectable()
export class DecksService {
  private url = 'http://localhost:8000/decks';

  constructor(private http: HttpClient) {
  }

  getAll(): Observable<Deck[]> {
    return this.http.get<Deck[]>(this.url);
  }

  get(id: string): Observable<Deck> {
    return this.http.get<Deck>(`${this.url}/${id}`);
  }

  post(deck: Deck): Observable<Deck> {
    return this.http.post<Deck>(this.url, deck);
  }

  put(id: string, deck: Deck): Observable<Deck> {
    return this.http.put<Deck>(`${this.url}/${id}`, deck);
  }

  patch(id: string, deck: Partial<Deck>): Observable<Deck> {
    return this.http.patch<Deck>(`${this.url}/${id}`, deck);
  }

  delete(id: string): Observable<Deck> {
    return this.http.delete<Deck>(`${this.url}/${id}`);
  }
}
