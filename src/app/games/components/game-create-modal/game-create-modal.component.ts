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
  selector: 'app-game-create-modal',
  templateUrl: './game-create-modal.component.html',
  styleUrls: ['./game-create-modal.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class GameCreateModalComponent implements OnInit {
  deck: number;

  @Input() modalName: string;
  @Input() decks: Deck[];

  @Output() create = new EventEmitter<{ deck: number }>();

  constructor() {
  }

  ngOnInit() {
  }

  onCreate(): void {
    this.create.emit({ deck: this.deck });
    $(`#${this.modalName}`).modal('hide');
  }
}
