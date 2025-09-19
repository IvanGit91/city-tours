import {Injector} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {BoService} from './bo/bo.service';
import {IMessageReplacement} from './bo/http-error-handler.service';

/*
import {
    HttpEvent,
    HttpEventType
} from '@angular/common/http';
*/
export abstract class Request {
  _bo: BoService;
  protected _withCredentials = true;

  constructor(injector: Injector) {
    this.initialize(injector);
  }

  /**
   * Creation (POST) action.
   * @method create
   * @param {string} uri API complete uri
   * @param {string} [newObj] JSON object to send
   * @param {string} [paramsObj] JSON object with params to add in query string
   * @param {string} [headerOpt] JSON object with header to add in request. if you add Content-Type with multipart/form-data value, will send a formdata object
   * @param messageReplacement
   * @param showLoader
   * @param logOnlyConsole
   */
  protected create(uri: string, newObj: {}, paramsObj?: {}, headerOpt?: {}, messageReplacement?: IMessageReplacement, showLoader?: boolean, logOnlyConsole?: boolean): Observable<any> {
    const params = this._bo.createParamsAndHeadersObj(paramsObj, headerOpt, 'response', this._withCredentials);
    const isMultipart = (params.headers.get('Content-Type') === 'multipart/form-data');
    let payload: FormData;
    if (isMultipart) {
      payload = this._getFormData(newObj);
      params.headers = params.headers.delete('Content-Type');
    }


    return (isMultipart) ? this._bo.post(uri, payload, params, messageReplacement, showLoader, logOnlyConsole) : this._bo.post(uri, newObj, params, messageReplacement, showLoader, logOnlyConsole);
  }

  protected search(uri: string, paramsObj?: {}, headerOpt?: {}, messageReplacement?: IMessageReplacement, showLoader?: boolean, logOnlyConsole?: boolean): Observable<any> {
    const params = this._bo.createParamsAndHeadersObj(paramsObj, headerOpt, 'response', this._withCredentials); // TODO IT WIL ME SET TO TRUE
    return this._bo.get(uri, params, messageReplacement, showLoader, logOnlyConsole);
  }

  protected delete(uri: string, paramsObj?: {}, headerOpt?: {}, messageReplacement?: IMessageReplacement, showLoader?: boolean, logOnlyConsole?: boolean): Observable<any> {
    const params = this._bo.createParamsAndHeadersObj(paramsObj, headerOpt, 'response', this._withCredentials);
    return this._bo.delete(uri, params, messageReplacement, showLoader, logOnlyConsole);
  }

  protected read(uri: string, paramsObj?: {}, headerOpt?: {}, messageReplacement?: IMessageReplacement, showLoader?: boolean, logOnlyConsole?: boolean): Observable<any> {
    const params = this._bo.createParamsAndHeadersObj(paramsObj, headerOpt, 'response', this._withCredentials);
    return this._bo.get(uri, params, messageReplacement, showLoader, logOnlyConsole);
  }

  protected update(uri: string, updObj: {}, paramsObj?: {}, headerOpt?: {}, messageReplacement?: IMessageReplacement, showLoader?: boolean, logOnlyConsole?: boolean): Observable<any> {
    const params = this._bo.createParamsAndHeadersObj(paramsObj, headerOpt, 'response', this._withCredentials);
    const isMultipart = (params.headers.get('Content-Type') === 'multipart/form-data');
    let payload: FormData;
    if (isMultipart) {
      payload = this._getFormData(updObj);
      params.headers.delete('Content-Type');
    }

    return (isMultipart) ? this._bo.put(uri, payload, params, messageReplacement, showLoader, logOnlyConsole) : this._bo.put(uri, updObj, params, messageReplacement, showLoader, logOnlyConsole);
  }

  protected upload(uri: string, payloadObj = {}, paramsObj?: {}, headerOpt?: {}, messageReplacement?: IMessageReplacement, showLoader?: boolean, logOnlyConsole?: boolean): Observable<any> {
    const payload: FormData = this._getFormData(payloadObj);
    const params = this._bo.createParamsAndHeadersObj(paramsObj, headerOpt, 'response', this._withCredentials);
    if (params.headers.get('Content-Type') === 'multipart/form-data') {
      params.headers.delete('Content-Type');
    }

    return this._bo.post(uri, payload, params, messageReplacement, showLoader, logOnlyConsole);
  }

  protected download(uri: string, filename: string, messageReplacement?: IMessageReplacement, showLoader?: boolean, logOnlyConsole?: boolean) {
    const params = this._bo.createParamsAndHeadersObj({}, {}, 'response', this._withCredentials, false, 'blob');
    const download = this._bo.get(uri, params, messageReplacement, showLoader, logOnlyConsole).pipe(
      map(res => {
        return {
          filename: filename,
          data: res.body
        };
      })
    );
    download.subscribe(res => {
      const url = window.URL.createObjectURL(res.data);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display: none');
      a.href = url;
      a.download = res.filename;
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove(); // remove the element
    });
  }

  private initialize(injector: Injector): void {
    this._bo = injector.get(BoService);
  }

  private _getFormData(payloadObj: {}): FormData {
    const payload = new FormData();
    if (payloadObj) {
      for (const k in payloadObj) {
        if (payloadObj.hasOwnProperty(k)) {
          if (payloadObj[k] instanceof Array) {
            // if (payloadObj[k][0] instanceof File) {
            if (payloadObj[k].length > 1) {
              for (let i = 0; i < payloadObj[k].length; i++) {
                payload.append(k, payloadObj[k][i]);
              }
            } else {
              payload.append(k, payloadObj[k][0]);
            }
            // }
          } else {
            payload.append(k, payloadObj[k]);
          }
        }
      }
    }
    return payload;
  }

  /*
  protected downloadPercent(uri: string, filename: string) {
      const params = this._bo.createParamsAndHeadersObj({}, {}, 'events', true, true, 'blob');
      const download = this._bo.get(uri, params);

      download.subscribe((event: HttpEvent<any>) => {


          switch (event.type) {
              case HttpEventType.DownloadProgress:
                  const kbLoaded = Math.round(event.loaded / 1024);
                  console.log(`Download in progress! ${kbLoaded}Kb loaded`);
                  break;
              case HttpEventType.Response:
                  const url = window.URL.createObjectURL(event.body);
                  const a = document.createElement('a');
                  document.body.appendChild(a);
                  a.setAttribute('style', 'display: none');
                  a.href = url;
                  a.download = filename;
                  a.click();
                  window.URL.revokeObjectURL(url);
                  a.remove(); // remove the element
          }
      }
      );

  }
  */

}
