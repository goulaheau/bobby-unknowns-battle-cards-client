import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
}               from '@angular/core';
import { Deck } from '../../../decks/models/deck';
import { Game } from '../../models/game';

declare var $: any;

@Component({
  selector: 'app-game-join-modal',
  templateUrl: './game-join-modal.component.html',
  styleUrls: ['./game-join-modal.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class GameJoinModalComponent implements OnInit {
  deck: number;

  @Input() modalName: string;
  @Input() decks: Deck[];
  @Input() game: Game;

  @Output() join = new EventEmitter<{ deck: number }>();

  constructor() {
  }

  ngOnInit() {
  }

  onJoin(): void {
    this.join.emit({ deck: this.deck });
    $(`#${this.modalName}`).modal('hide');
  }
}
