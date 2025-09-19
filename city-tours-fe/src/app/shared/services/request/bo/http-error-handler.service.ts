import {Injectable} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';

import {Observable, Subscription, throwError as _throw} from 'rxjs';

import {IMessage, MessageService} from '../../message/message.service';

import {TranslateService} from '@ngx-translate/core';

// TODO evaluate if cod must have a property to indicate a range of error or not
interface IReplacement {
  [k: string]: string;
}

export interface IMessageReplacement {
  [cod: string]: {
    translationKey: string
    replacementValue?: IReplacement
  };
}

/** Type of the handleError function returned by HttpErrorHandler.createHandleError */
export type HandleError =
  <T> (operation?: string, result?: T, messageReplacement?: IMessageReplacement, logOnlyConsole?: boolean) => (error: HttpErrorResponse) => Observable<T>;

/** Handles HttpClient errors */
@Injectable()
export class HttpErrorHandler {
  constructor(private messageService: MessageService, private translate: TranslateService) {
  }

  /** Create curried handleError function that already knows the service name */
  createHandleError = (serviceName = '') => <T>
  (operation = 'operation', result = {} as T, messageReplacement?: IMessageReplacement, logOnlyConsole?: boolean) => this.handleError(serviceName, operation, result, messageReplacement, logOnlyConsole)

  /**
   * Returns a function that handles Http operation failures.
   * This error handler lets the app continue to run as if no error occurred.
   * @param serviceName = name of the data service that attempted the operation
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   * @param messageReplacement
   * @param logOnlyConsole
   */
  handleError<T>(serviceName = '', operation = 'operation', result = {} as T, messageReplacement?: IMessageReplacement, logOnlyConsole?: boolean) {

    return (error: HttpErrorResponse): Observable<T> => {
      let message: IMessage;
      const subscription$ = new Subscription();
      return _throw(
        // from(
        (new Promise(resolve => {
            let translationKey = 'ERROR_MSG.BO_STANDARDMSG';

            let replacementValue: IReplacement;
            replacementValue = {
              'code': error.status !== undefined && (error.status.toString() !== '0') ? error.status.toString() : ' - ' + error.statusText,
              'errorMessage': ((error.error && error.error.errorMessage) ? error.error.errorMessage : '')
            }; // , 'message': error.message
            // let isMessageReplacement = false;
            if (messageReplacement) {
              if (messageReplacement.hasOwnProperty(error.status)) {
                // isMessageReplacement = true;
                translationKey = messageReplacement[error.status].translationKey;
                replacementValue = (messageReplacement[error.status].replacementValue) ? messageReplacement[error.status].replacementValue : {};
              }
            }

            subscription$.add(
              this.translate.get(translationKey, replacementValue).subscribe(
                ((res: string) => {
                    message = {
                      type: 'danger',
                      // showIn: 'default',
                      message: (error.error instanceof ErrorEvent) ? error.error.message : res, //(res + ((isMessageReplacement) ? ((error.error.errorMessage) ? error.error.errorMessage : '') : '')
                      onlyConsole: (logOnlyConsole) ? logOnlyConsole : false
                    };
                    this.messageService.add(message);
                    subscription$.unsubscribe();
                    resolve(message);
                  }
                )
              )
            );

          })
        )// .then(m => m)
        // )
      );


    };

  }
}


/*
Copyright 2017-2018 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
