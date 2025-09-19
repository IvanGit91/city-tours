import {HttpHeaders, HttpParams} from '@angular/common/http';

export interface IHeadersParams {
  headers?: HttpHeaders;
  params?: HttpParams;
  observe?: any;
  withCredentials?: boolean;
  reportProgress?: boolean;
  responseType?: any;

}
