import {District} from "../District";
import {Geo} from "../geo/Geo";
import {TypizedFile} from "../common/TypizedFile";
import {BaseModel} from "../common/BaseModel";
import {DistTel} from "../common/DistTel";

export class Poi extends BaseModel {

  denomination: string;

  description: string;

  descriptionEng: string;

  phone: DistTel;

  address: string;

  webSite: string;

  time: string;

  email: string;

  imagePath: string;

  image: TypizedFile;

  type: string;

  district: District;

  geo: Geo;

  light: boolean;

  constructor() {
    super();
  }
}
