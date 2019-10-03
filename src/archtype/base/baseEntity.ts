import { Guid } from "guid-typescript";
import { IBaseEntity } from "../interfaces/iBaseEntitity";

export class BaseEntity implements IBaseEntity {
  id: string = Guid.create().toString();
  date: Date = new Date();
}
