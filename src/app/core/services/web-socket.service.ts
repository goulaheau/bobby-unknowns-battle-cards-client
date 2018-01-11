import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Observer} from 'rxjs/Observer';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class WebSocketService {
  socket: WebSocket;

  constructor() {
  }

  connect(url: string): void {
    if (!this.socket) {
      this.socket = new WebSocket(url);
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}
