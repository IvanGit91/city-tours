import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient} from "@angular/common/http";
import {ConfigService} from "../../config.service";
import {catchError, tap} from "rxjs/operators";
import {ErrorService} from "./error.service";
import {Search} from "../../../model/Search";

@Injectable({
  providedIn: 'root'
})
export class SearchService extends ErrorService {
  private readonly apiUrl;

  private _values = new BehaviorSubject<Search[]>([]);
  readonly values = this._values.asObservable();

  constructor(private _config: ConfigService, private http: HttpClient) {
    super();
    this.apiUrl = _config.apiUrl + '/search';
  }

  search(value: string): Observable<Search[]> {
    const url = this.apiUrl + `/do`;
    return this.http.get<Search[]>(url, {
      params: {
        value: value
      }
    }).pipe(
      tap(v => {
        this._values.next(v);
      }), catchError(this.errorHandler));
  }

}
