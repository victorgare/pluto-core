import { BaseEntity } from "../../archtype/base/baseEntity";
import ccxt = require("ccxt");
import { OrderBook } from "./orderBook";

export class Analyze extends BaseEntity {
  /**
   *
   */
  constructor(fields?: object) {
    super();

    Object.assign(this, fields);
  }

  exchange: ccxt.Exchange;
  orderBook: OrderBook[];
}
