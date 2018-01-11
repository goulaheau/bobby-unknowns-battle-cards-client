import { Component, OnInit } from '@angular/core';
import { DecksService } from '../../../core/services/decks.service';
import { Observable } from 'rxjs/Observable';
import { Deck } from '../../models/deck';
import { AuthService } from '../../../auth/services/auth.service';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-decks-page',
  templateUrl: './decks-page.component.html',
  styleUrls: ['./decks-page.component.scss'],
})
export class DecksPageComponent implements OnInit {
  decks$: Observable<Deck[]>;
  params: HttpParams;

  constructor(private decksService: DecksService,
              private authService: AuthService) { }

  ngOnInit() {
    this.authService.current_user().subscribe(
      user => {
        this.params = new HttpParams().set('user', user.id.toString());
        this.decks$ = this.decksService.getAll(this.params);
      },
    );
  }

  onDelete(deck: Deck): void {
    this.decksService.delete(deck.id).subscribe(
      res => this.decks$ = this.decksService.getAll(this.params),
    );
  }
}
