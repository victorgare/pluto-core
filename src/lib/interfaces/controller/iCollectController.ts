import { BaseClass } from "../../../archtype/base/baseClass";
import { Context } from "@azure/functions";
import ccxt = require("ccxt");
import { Analyze } from "../../domain/analyze";

export interface ICollectController {
  collect(): Promise<void>;
  getInfo(exchangeId: string): Promise<Analyze>;
}
