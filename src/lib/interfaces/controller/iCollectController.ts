import { BaseClass } from "../../../archtype/base/baseClass";

export interface ICollectController {
  collect(): Promise<void>;
}
