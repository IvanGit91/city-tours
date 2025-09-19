import {Injectable, Injector} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConfigService, Request} from '../..';
import {Observable} from 'rxjs';
import {TypizedFile} from 'src/app/model/common/TypizedFile';

@Injectable({
  providedIn: 'root'
})
export class FileService extends Request {

  private readonly apiUrl;

  constructor(private _config: ConfigService, private injector: Injector, private http: HttpClient) {
    super(injector);
    this.apiUrl = _config.apiUrl;
  }

  getResourceUri(resource: string): Observable<TypizedFile> {
    const url = this.apiUrl + `/download`;
    return this.http.get<TypizedFile>(url, {
      params: {
        path: resource
      }
    })
  }
}
