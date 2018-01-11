import { Component, Input, OnInit, ViewEncapsulation, } from '@angular/core';
import { Game } from '../../models/game';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class GameListComponent implements OnInit {
  @Input() games: Game[];

  constructor() { }

  ngOnInit() {
  }
}
