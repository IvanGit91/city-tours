import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from "@angular/common/http";
import {ConfigService} from "../../config.service";
import {Poi} from "../../../model/poi/Poi";
import {PageablePoi} from "../../../model/poi/PageablePoi";
import {catchError} from "rxjs/operators";
import {ElementService} from "./element.service";

@Injectable({
  providedIn: 'root'
})
export class PoiService extends ElementService<Poi> {
  constructor(_config: ConfigService, http: HttpClient) {
    super(_config, http, 'poi');
  }

  getAllByDistrict(districtId: number): Observable<Poi[]> {
    const url = this.apiUrl + `/all/${districtId}`;
    return this.http.get<Poi[]>(url).pipe(catchError(this.errorHandler));
  }

  getAllLightByDistrict(districtId: number): Observable<Poi[]> {
    const url = this.apiUrl + `/light/all/${districtId}`;
    return this.http.get<Poi[]>(url).pipe(catchError(this.errorHandler));
  }

  getAllByDistrictPage(districtId: number, page: number, size: number): Observable<PageablePoi> {
    const url = this.apiUrl + `/${districtId}/pageable?page=${page}&size=${size}`;
    return this.http.get<PageablePoi>(url).pipe(catchError(this.errorHandler));
  }

  getAllOrderedByApprovalDate(): Observable<Poi[]> {
    const url = this.apiUrl + `/orderedApprovalDate`;
    return this.http.get<Poi[]>(url).pipe(catchError(this.errorHandler));
  }

  getAllRedactorOrderedByApprovalDate(id: number): Observable<Poi[]> {
    const url = this.apiUrl + `/redactor/${id}`;
    return this.http.get<Poi[]>(url).pipe(catchError(this.errorHandler));
  }

  upload(id: number, image: any): Observable<Poi> {
    const formData: FormData = new FormData();
    formData.append('file', image, image.name);
    const url = this.apiUrl + this.authUrl + '/upload/' + id;
    return this.http.post<Poi>(url, formData, {
      reportProgress: true,
      responseType: 'json'
    }).pipe(catchError(this.errorHandler));
  }

  setApprovalDate(id: number): Observable<Poi> {
    const url = this.apiUrl + this.authUrl + `/approvalDate/${id}`;
    return this.http.patch<Poi>(url, null);
  }
}
