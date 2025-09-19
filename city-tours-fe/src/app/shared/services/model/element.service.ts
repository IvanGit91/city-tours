import {Inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError} from "rxjs/operators";
import {ConfigService} from "../../config.service";
import {Observable} from "rxjs";
import {BaseModel} from "../../../model/common/BaseModel";
import {BaseService} from "./base.service";

@Injectable({
  providedIn: 'root'
})
export class ElementService<T extends BaseModel> extends BaseService<T> {
  constructor(protected _config: ConfigService, protected http: HttpClient, @Inject('apielem') apielem: string) {
    super(_config, http, apielem);
  }

  getAllApproved(): Observable<T[]> {
    const url = this.apiUrl + `/approved`;
    return this.http.get<T[]>(url).pipe(catchError(this.errorHandler));
  }
}
