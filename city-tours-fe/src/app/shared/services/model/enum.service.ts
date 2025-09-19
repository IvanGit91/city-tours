import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient} from "@angular/common/http";
import {ConfigService} from "../../config.service";
import {DistEnumData} from "../../../model/common/DistEnumData";
import {DistEnum} from "../../../model/common/DistEnum";
import {catchError} from "rxjs/operators";
import {ErrorService} from "./error.service";

@Injectable({
  providedIn: 'root'
})
export class EnumService extends ErrorService {
  private readonly apiUrl;

  private _poiTypes = new BehaviorSubject<DistEnumData[]>([]);
  readonly poiTypes = this._poiTypes.asObservable();

  constructor(private _config: ConfigService, private http: HttpClient) {
    super();
    this.apiUrl = _config.apiUrl + '/enum';
    this.poiType().subscribe(ptype => this._poiTypes.next(ptype.data));
  }

  poiType(): Observable<DistEnum> {
    const url = this.apiUrl + `/poiType`;
    return this.http.get<DistEnum>(url).pipe(catchError(this.errorHandler));
  }
}
