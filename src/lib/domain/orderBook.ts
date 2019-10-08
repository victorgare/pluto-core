import { BaseEntity } from "../../archtype/base/baseEntity";
import ccxt = require("ccxt");

export class OrderBook extends BaseEntity {
  /**
   *
   */
  constructor(fields?: object) {
    super();

    Object.assign(this, fields);
  }

  market: ccxt.Market;
  marketKey: string;
  orderBook: ccxt.OrderBook;
}
