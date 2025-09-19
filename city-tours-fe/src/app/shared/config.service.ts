import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private _environmentObj = environment;
  private _currHost = window.location.host;

  constructor() {

  }

  get apiUrl(): string {
    return this._environmentObj.apiUrl;
  }
}
