import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { Deck } from '../../../decks/models/deck';

declare var $: any;

@Component({
  selector: 'app-game-form-modal',
  templateUrl: './game-form-modal.component.html',
  styleUrls: ['./game-form-modal.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class GameFormModalComponent implements OnInit {
  deck: number;

  @Input() modalName: string;
  @Input() decks: Deck[];

  @Output() create = new EventEmitter<{ deck: number }>();

  constructor() {
  }

  ngOnInit() {
  }

  onSubmit(): void {
    this.create.emit({ deck: this.deck });
    $(`#${this.modalName}`).close();
  }
}
