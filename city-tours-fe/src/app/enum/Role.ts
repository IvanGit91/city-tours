export enum Role {
  Administrator = 'ROLE_ADMINISTRATOR',
  Redactor = 'ROLE_REDACTOR'
}

export class RoleItem {

  id: number;
  name: string;
}

export const ROLE: RoleItem[] = [
  {id: 1, name: Role.Administrator},
  {id: 2, name: Role.Redactor}
];
