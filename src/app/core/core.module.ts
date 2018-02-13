import { HeaderComponent } from './components/header/header.component';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NgProgressModule,
  NgProgressBrowserXhr,
  NgProgressInterceptor,
} from 'ngx-progressbar';

// Import HttpClientModule from @angular/common/http
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from '../auth/interceptors/token.interceptor';

import { AppComponent }      from './containers/app/app.component';
import { CardValuesService } from './services/card-values.service';
import { DecksService }      from './services/decks.service';
import { CardsService }      from './services/cards.service';
import { RulesService }      from './services/rules.service';
import { UsersService }      from './services/users.service';
import { WebSocketService }  from './services/web-socket.service';
import { GamesService }      from './services/games.service';

export const COMPONENTS = [
  AppComponent,
  HeaderComponent,
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    HttpClientModule,
    NgProgressModule,
  ],
  declarations: COMPONENTS,
  exports: COMPONENTS,
  providers: [
    WebSocketService,
  ],
})
export class CoreModule {
  static forRoot() {
    return {
      ngModule: CoreModule,
      providers: [
        { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: NgProgressInterceptor,
          multi: true,
        },
        DecksService,
        CardsService,
        UsersService,
        GamesService,
        CardValuesService,
        RulesService,
      ],
    };
  }
}
