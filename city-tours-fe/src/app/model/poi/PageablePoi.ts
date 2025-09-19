import {Pageable} from "../common/Pageable";
import {Poi} from "./Poi";

export class PageablePoi extends Pageable {

  content: Poi[];

  constructor() {
    super();
  }
}
