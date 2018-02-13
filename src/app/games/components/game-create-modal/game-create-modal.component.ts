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
import { Rule } from '../../models/rule';

declare var $: any;

@Component({
  selector: 'app-game-create-modal',
  templateUrl: './game-create-modal.component.html',
  styleUrls: ['./game-create-modal.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class GameCreateModalComponent implements OnInit {
  deck: number;
  rule: number;

  @Input() modalName: string;
  @Input() decks: Deck[];
  @Input() rules: Rule[];

  @Output() create = new EventEmitter<{ deck: number, rule: number }>();

  constructor() {
  }

  ngOnInit() {
  }

  onCreate(): void {
    this.create.emit({ deck: this.deck, rule: this.rule });
    $(`#${this.modalName}`).modal('hide');
  }
}
