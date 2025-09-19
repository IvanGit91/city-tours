import {Injectable, OnDestroy} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Method} from './method.enum';
import {catchError, finalize} from 'rxjs/operators';
import {HandleError, HttpErrorHandler, IMessageReplacement} from './http-error-handler.service';
import {IHeadersParams} from './iheaders-params';
import {NgxUiLoaderService} from 'ngx-ui-loader';
// import { _throw } from 'rxjs/observable/throw';

// import {ConfigService} from '../../services/config.service';

class HeadersParam implements IHeadersParams {
  headers?: HttpHeaders = new HttpHeaders();
  params?: HttpParams = new HttpParams();
  observe?: string;
  withCredentials?: boolean;
  responseType?: string;
}


@Injectable({
  providedIn: 'root'
})
export class BoService implements OnDestroy {
  private _handleError: HandleError;
  private _calls = 0;

  constructor(private httpErrorHandler: HttpErrorHandler, private _http: HttpClient, private _loader: NgxUiLoaderService) {
    this._handleError = this.httpErrorHandler.createHandleError('BoService');
  }

  private _apiUrl = '';

  get apiUrl(): string {
    return this._apiUrl;
  }

  set apiUrl(uri: string) {
    this._apiUrl = uri;
  }

  // Authorization: Bearer
  private _authTok = '';

  set authTok(tok: string) {
    this._authTok = tok;
  }

  ngOnDestroy(): void {
    this._http = undefined;
  }

  //
  createParamsAndHeadersObj(httpParams?: {}, headerOpt?: {}, observe?: 'response' | 'body' | 'events', withCredentialsOpt?: boolean, withReportProgressOpt?: boolean, withResponseTypeOpt?: 'arraybuffer' | 'blob' | 'json' | 'text'): IHeadersParams {
    let params = new HttpParams(); // params?{}:{}; //query string
    let headers = new HttpHeaders(); // params?{}:{};
    const options: IHeadersParams = new HeadersParam();
    options.withCredentials = withCredentialsOpt === undefined ? false : withCredentialsOpt;
    options.reportProgress = withReportProgressOpt === undefined ? false : withReportProgressOpt;
    if (withResponseTypeOpt !== undefined) {
      options.responseType = withResponseTypeOpt;
    }

    if (observe !== undefined) {
      options.observe = observe;
    }
    if (httpParams) { // { params: new HttpParams().set('name', term) }
      for (let k in httpParams) {
        if (httpParams[k] instanceof Array) {
          httpParams[k].forEach(val => {
            if (val !== '') {
              params = params.append(k, val);
            }
          });
        } else {
          if (httpParams[k] !== '') {
            params = params.append(k, httpParams[k]);
          }
        }
      }
      options.params = params;
    }

    if (headerOpt) { // { params: new HttpParams().set('name', term) }
      for (let k in headerOpt) {
        if (headerOpt[k] instanceof Array) {
          headerOpt[k].forEach(val => {
            headers = headers.append(k, val);
          });
        } else {
          headers = headers.append(k, headerOpt[k]);
        }
      }
      options.headers = headers;
    }

    return options;
  }

  get(uri: string, headerParamsOpt?: IHeadersParams, messageReplacement?: IMessageReplacement, showLoader?: boolean, logOnlyConsole?: boolean): Observable<any> {
    return this.execute(uri, Method.GET, {}, headerParamsOpt, messageReplacement, showLoader, logOnlyConsole);
  }

  post(uri: string, body: {}, headerParamsOpt?: IHeadersParams, messageReplacement?: IMessageReplacement, showLoader?: boolean, logOnlyConsole?: boolean): Observable<any> {
    return this.execute(uri, Method.POST, body, headerParamsOpt, messageReplacement, showLoader, logOnlyConsole);
  }

  put(uri: string, body: {}, headerParamsOpt?: IHeadersParams, messageReplacement?: IMessageReplacement, showLoader?: boolean, logOnlyConsole?: boolean): Observable<any> {
    return this.execute(uri, Method.PUT, body, headerParamsOpt, messageReplacement, showLoader, logOnlyConsole);
  }

  delete(uriDelete: string, headerParamsOpt?: IHeadersParams, messageReplacement?: IMessageReplacement, showLoader?: boolean, logOnlyConsole?: boolean): Observable<any> {
    return this.execute(uriDelete, Method.DELETE, {}, headerParamsOpt, messageReplacement, showLoader, logOnlyConsole);
  }

  private stopLoader() {
    this._calls = this._calls-- < 0 && 0 || this._calls;
    if (this._calls === 0) {
      this._loader.stop();
    }
  }

  private execute(
    uri: string,
    method: Method.DELETE | Method.PUT | Method.POST | Method.GET,
    body: any,
    httpOptions?: IHeadersParams,
    messageReplacement?: IMessageReplacement,
    showLoader?: boolean,
    logOnlyConsole?: boolean
  ): Observable<any> {
    let ResultObs: Observable<any>;
    const endpoint = (this.apiUrl !== '') ? this.apiUrl + '/' + uri : uri;
    showLoader = (showLoader === undefined) ? true : showLoader;
    logOnlyConsole = (logOnlyConsole === undefined) ? false : logOnlyConsole;
    if (httpOptions !== undefined) {
      httpOptions.headers = this.addDefaultHeader(method, httpOptions.headers);
    } else {
      httpOptions = new HeadersParam();
      httpOptions.headers = this.addDefaultHeader(method, httpOptions.headers);
    }
    if (showLoader) {
      this._loader.start();
      this._calls++;
    }
    switch (method) {
      case Method.GET:
        ResultObs = this._http
          .get(endpoint, httpOptions)
          .pipe(
            finalize(() => showLoader && this.stopLoader()),
            catchError(this._handleError(uri, Method.GET, messageReplacement, logOnlyConsole))
          );
        break;
      case Method.POST:
        ResultObs = this._http
          .post(endpoint, body, httpOptions)
          .pipe(
            finalize(() => showLoader && this.stopLoader()),
            catchError(this._handleError(uri, Method.POST, messageReplacement, logOnlyConsole))
          );
        break;
      case Method.PUT:
        ResultObs = this._http
          .put(endpoint, body, httpOptions)
          .pipe(
            finalize(() => showLoader && this.stopLoader()),
            catchError(this._handleError(uri, Method.PUT, messageReplacement, logOnlyConsole))
          );

        break;
      case Method.DELETE:
        ResultObs = this._http
          .delete(endpoint, httpOptions)
          .pipe(
            finalize(() => showLoader && this.stopLoader()),
            catchError(this._handleError(uri, Method.DELETE, messageReplacement, logOnlyConsole))
          );
        break;
    }

    return ResultObs;
  }

  private addDefaultHeader(method: Method, presetHeaders?: HttpHeaders): HttpHeaders {
    let newHeaders = presetHeaders || new HttpHeaders();
    /*if ([Method.DELETE, Method.PUT, Method.POST].indexOf(method) >= 0) {
      if (!newHeaders.has('Content-Type')) {
        newHeaders = newHeaders.append('Content-Type', 'application/json');
      }
    }*/
    if (this._authTok !== '') {
      if (!newHeaders.has('Authorization')) {
        newHeaders = newHeaders.append('Authorization:', 'Bearer ' + this._authTok);
      }
    }
    return newHeaders;
  }

}
