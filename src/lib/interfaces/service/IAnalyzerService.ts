import { BaseClass } from "../../../archtype/base/baseClass";
import ccxt = require("ccxt");
import { Analyze } from "../../domain/analyze";

export interface IAnalyzerService extends BaseClass {
  getInfo(exchange: ccxt.Exchange): Promise<Analyze>;
  analyzeOpportunities(
    firstEntry: Analyze,
    secondEntry: Analyze
  ): Promise<void>;
}
