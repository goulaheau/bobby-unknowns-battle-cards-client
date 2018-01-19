import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { CardValues } from '../../games/models/card-values';

@Injectable()
export class CardValuesService {
  private url = 'http://localhost:8000/card-values/';

  constructor(private http: HttpClient) {
  }

  getAll(): Observable<CardValues[]> {
    return this.http.get<CardValues[]>(`${this.url}`);
  }

  get(id: number): Observable<CardValues> {
    return this.http.get<CardValues>(`${this.url}${id}/`);
  }

  post(cardValues: CardValues): Observable<CardValues> {
    return this.http.post<CardValues>(this.url, cardValues);
  }

  put(id: number, cardValues: CardValues): Observable<CardValues> {
    return this.http.put<CardValues>(`${this.url}${id}/`, cardValues);
  }

  patch(id: number, cardValues: CardValues): Observable<CardValues> {
    return this.http.patch<CardValues>(`${this.url}${id}/`, cardValues);
  }

  delete(id: number): Observable<CardValues> {
    return this.http.delete<CardValues>(`${this.url}${id}/`);
  }
}
