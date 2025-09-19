import {Role, RoleItem} from "../enum/Role";
import {BaseModel} from "./common/BaseModel";

export class User extends BaseModel {

  email: string;

  password: string;

  name: string;

  phone: string;

  address: string;

  active: boolean;

  role: RoleItem;

  verify: boolean;

  constructor() {
    super();
    this.active = true;
    this.role.name = Role.Administrator;
  }
}
