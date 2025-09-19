import {Geo} from "./geo/Geo";
import {TypizedFile} from "./common/TypizedFile";
import {BaseModel} from "./common/BaseModel";
import {DistTel} from "./common/DistTel";
import {User} from "./User";

export class District extends BaseModel {

  denomination: string;

  description: string;

  descriptionEng: string;

  phone: DistTel;

  address: string;

  webSite: string;

  email: string;

  imagePath: string;

  logoPath: string;

  image: TypizedFile;

  logo: TypizedFile;

  geos: Geo[];

  color: any;

  redactor: User;

  constructor(d?: District) {
    super();
    if (d !== undefined && d !== null) {
      Object.keys(d).forEach(k => {
        this[k] = d[k];
      });
    }
  }

  public greet() {
    console.log("Hello, " + this.denomination);
  }
}
