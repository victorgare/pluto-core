import { BaseClass } from "../../../archtype/base/baseClass";
import ccxt = require("ccxt");

export interface IAnalyzerService extends BaseClass {
  analyzeOpportunities(
    firstExchange: ccxt.Exchange,
    secondExchange: ccxt.Exchange
  ): Promise<void>;
}
