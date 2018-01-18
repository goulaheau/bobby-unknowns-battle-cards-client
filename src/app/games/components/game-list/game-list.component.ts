import {
  Component, EventEmitter, Input, OnInit, Output,
  ViewEncapsulation,
}               from '@angular/core';
import { Deck } from '../../../decks/models/deck';
import { Game } from '../../models/game';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class GameListComponent implements OnInit {
  gameSelected: Game;

  @Input() games: Game[];
  @Input() decks: Deck[];
  @Input() user: number;

  @Output() join = new EventEmitter<Game>();

  constructor() { }

  ngOnInit() {
  }

  onJoin(data: { deck: number }): void {
    this.gameSelected.opponent = this.user;
    this.gameSelected.opponent_deck = data.deck;
    this.join.emit(this.gameSelected);
  }
}
