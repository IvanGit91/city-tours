import {GeoProperties} from "./GeoProperties";
import {Geometry} from "./Geometry";
import {BaseModel} from "../common/BaseModel";

export class Geo extends BaseModel {

  properties: GeoProperties;
  geometry: Geometry;

  constructor() {
    super();
    this.properties = new GeoProperties();
    this.geometry = new Geometry();
  }
}
