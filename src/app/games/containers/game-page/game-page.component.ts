import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';

import {GamesService} from '../../../core/services/games.service';
import {ActivatedRoute} from '@angular/router';
import {User} from "../../../auth/models/user";
import {AuthService} from "../../../auth/services/auth.service";

@Component({
  selector: 'app-game-page',
  templateUrl: './game-page.component.html',
  styleUrls: ['./game-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class GamePageComponent implements OnInit, OnDestroy {
  game_id: number;
  user: User;

  constructor(private route: ActivatedRoute,
              private gamesService: GamesService,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.authService.current_user().subscribe(
      user => {
        this.user = user;
        this.route.params.subscribe(params => {
          this.game_id = +params['id'];

          if (this.game_id) {
            this.gamesService.connect(this.game_id, this.user.id);
          }
        });
      },
    );
  }

  ngOnDestroy(): void {
    this.gamesService.disconnect();
  }
}
