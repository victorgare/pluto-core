import { IBaseClass } from "../interfaces/iBaseClass";
import { injectable } from "inversify";

@injectable()
export class BaseClass implements IBaseClass {
  constructor() {}
}
