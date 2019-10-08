import { Guid } from "guid-typescript";
import { IBaseEntity } from "../interfaces/iBaseEntitity";

export class BaseEntity implements IBaseEntity {
  constructor() {
    this.id = Guid.create().toString();
    this.date = new Date().toISOString();
  }

  id: string;
  date: string | Date;
}
