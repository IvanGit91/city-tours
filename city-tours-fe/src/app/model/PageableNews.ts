import {Pageable} from "./common/Pageable";
import {News} from "./News";

export class PageableNews extends Pageable {

  content: News[];

  constructor() {
    super();
  }
}
