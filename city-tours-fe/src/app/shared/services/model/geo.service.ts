import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ConfigService} from "../../config.service";
import {BaseService} from "./base.service";
import {Geo} from "../../../model/geo/Geo";

@Injectable({
  providedIn: 'root'
})
export class GeoService extends BaseService<Geo> {

  constructor(_config: ConfigService, http: HttpClient) {
    super(_config, http, 'geo');
  }
}
