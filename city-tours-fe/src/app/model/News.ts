import {TypizedFile} from "./common/TypizedFile";
import {User} from "./User";

export class News {

  id: number;
  title: string;
  description: string;
  descriptionExtended: string;
  descriptionEng: string;
  publicationDate: Date;
  approvalDate: Date;
  pathImage: string;
  image: TypizedFile;
  author: string;
  totalElements: number;
  redactor: User;

  constructor() {
  }
}
