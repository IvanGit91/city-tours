import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';


export interface IMessage {
  type: 'info' | 'success' | 'warning' | 'danger';
  // showIn: 'default' | 'toaster',
  message: string;
  delay?: number;
  onlyConsole?: boolean;
}

@Injectable()
export class MessageService {
  private messages: BehaviorSubject<IMessage> = new BehaviorSubject(null); // Array<IMessage> = [];
  private messagesNext: Array<IMessage> = []; // Array<IMessage> = [];

  constructor() {
  }

  get getMessages(): BehaviorSubject<IMessage> {
    // console.log('getMessages');
    for (const message of this.messagesNext) {
      this.messages.next(message);
    }

    this.messagesNext = [];
    return this.messages;
  }

  /*
  messagesOf(type: 'info' | 'success' | 'warning' | 'danger'): Array<IMessage> {
    return this.messages.filter((x)=> x.type === type );
  }
  */

  get messageNext() {
    return this.messagesNext;
  }

  add(message: IMessage) { // , showAfter: boolean = false
    if (!message) {
      return;
    }

    const showAfter = false;
    if (!message.onlyConsole) {
      (!showAfter) ? this.messages.next(message) : this.messagesNext.push(message);
    } else {
      console.log(message.message);
    }
  }

  reset() {
    this.messages.next(null);
  }

  clear() {
    this.messages.unsubscribe();
  }
}
