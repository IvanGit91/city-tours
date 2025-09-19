import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from "@angular/common/http";
import {ConfigService} from "../../config.service";
import {District} from "../../../model/District";
import {catchError, map} from "rxjs/operators";
import {ElementService} from "./element.service";

@Injectable({
  providedIn: 'root'
})
export class DistrictService extends ElementService<District> {

  constructor(_config: ConfigService, http: HttpClient) {
    super(_config, http, 'district');
  }

  getByIdClass(id: number): Observable<District> {
    const url = this.apiUrl + `/${id}`;
    return this.http.get<District>(url).pipe(catchError(this.errorHandler)).pipe(
      map(e => new District(e))
    );
  }

  getAllOrderedByApprovalDate(): Observable<District[]> {
    const url = this.apiUrl + `/orderedApprovalDate`;
    return this.http.get<District[]>(url).pipe(catchError(this.errorHandler));
  }

  getAllRedactorOrderedByApprovalDate(id: number): Observable<District[]> {
    const url = this.apiUrl + `/redactor/${id}`;
    return this.http.get<District[]>(url).pipe(catchError(this.errorHandler));
  }

  upload(id: number, image: any, logo: boolean): Observable<District> {
    const formData = new FormData();
    formData.append('file', image);
    const url = this.apiUrl + this.authUrl + '/upload/' + id + '/' + logo;
    return this.http.post<District>(url, formData, {
      reportProgress: true,
      responseType: 'json'
    }).pipe(catchError(this.errorHandler));
  }

  setApprovalDate(id: number): Observable<District> {
    const url = this.apiUrl + this.authUrl + `/approvalDate/${id}`;
    return this.http.patch<District>(url, null);
  }
}
