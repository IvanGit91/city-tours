import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient} from "@angular/common/http";
import {ConfigService} from "../../config.service";
import {City} from "../../../model/City";
import {catchError} from "rxjs/operators";
import {ErrorService} from "./error.service";
import {OverlayRef} from "@angular/cdk/overlay";

@Injectable({
  providedIn: 'root'
})
export class UtilityService extends ErrorService {
  overlayRef: OverlayRef;
  protected readonly authUrl = '/auth';
  private readonly apiUrl;
  private _allCities = new BehaviorSubject<City[]>([]);
  readonly allCities = this._allCities.asObservable();
  private _itaLayer = new BehaviorSubject<any>([]);
  readonly itaLayer = this._itaLayer.asObservable();

  constructor(private _config: ConfigService, private http: HttpClient) {
    super();
    this.apiUrl = _config.apiUrl + '/utility';
    //this.cities().subscribe(c => this._allCities.next(c));
    this.italianLayer().subscribe(i => this._itaLayer.next(i));
  }

  cities(): Observable<City[]> {
    const url = this.apiUrl + `/cities`;
    return this.http.get<City[]>(url).pipe(catchError(this.errorHandler));
  }

  citiesFilter(startsWith: any): Observable<City[]> {
    const url = this.apiUrl + `/cities/filter`;
    return this.http.get<City[]>(url, {
      params: {
        startsWith: startsWith
      }
    }).pipe(catchError(this.errorHandler));
  }

  italianLayer(): Observable<any> {
    const url = this.apiUrl + `/italianLayer`;
    return this.http.get<any>(url).pipe(catchError(this.errorHandler));
  }

  upload(image: any, backend: boolean): any {
    const formData: FormData = new FormData();
    formData.append('file', image, image.name);
    const op = backend ? 'backend' : 'frontend';
    const url = this.apiUrl + this.authUrl + '/upload/' + op;
    return this.http.post<any>(url, formData, {
      reportProgress: true,
      responseType: 'json'
    }).pipe(catchError(this.errorHandler));
  }
}
