import {Inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError} from "rxjs/operators";
import {ConfigService} from "../../config.service";
import {Observable} from "rxjs/index";
import {ErrorService} from "./error.service";
import {BaseModel} from "../../../model/common/BaseModel";

@Injectable({
  providedIn: 'root'
})
export class BaseService<T extends BaseModel> extends ErrorService {

  protected readonly apiUrl;
  protected readonly authUrl = '/auth';

  constructor(protected _config: ConfigService, protected http: HttpClient, @Inject('apielem') apielem: string) {
    super();
    this.apiUrl = _config.apiUrl + '/' + apielem;
  }

  getById(id: number): Observable<T> {
    const url = this.apiUrl + `/${id}`;
    return this.http.get<T>(url).pipe(catchError(this.errorHandler));
  }

  getAll(): Observable<T[]> {
    const url = this.apiUrl + `/`;
    return this.http.get<T[]>(url).pipe(catchError(this.errorHandler));
  }

  getAllLight(): Observable<T[]> {
    const url = this.apiUrl + `/light`;
    return this.http.get<T[]>(url).pipe(catchError(this.errorHandler));
  }

  save(p: T): Observable<T> {
    const url = this.apiUrl + this.authUrl + '/';
    return this.http.post<T>(url, p).pipe(catchError(this.errorHandler));
  }

  update(d: T): Observable<T> {
    const url = this.apiUrl + this.authUrl + '/' + d.id;
    return this.http.put<T>(url, d).pipe(catchError(this.errorHandler));
  }

  delete(id: number) {
    const url = this.apiUrl + this.authUrl + `/${id}`;
    return this.http.delete(url).pipe(catchError(this.errorHandler));
  }

  deleteLogical(id: number) {
    const url = this.apiUrl + this.authUrl + `/logical/${id}`;
    return this.http.delete(url).pipe(catchError(this.errorHandler));
  }

}
