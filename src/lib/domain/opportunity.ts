import { BaseEntity } from "../../archtype/base/baseEntity";

export class Opportunity extends BaseEntity {
  /**
   *
   */
  constructor(fields?: object) {
    super();

    Object.assign(this, fields);
  }

  buyAtExchange: string;
  sellAtExchange: string;
  buyCoin: string;
  sellCoin: string;
  buyAtPrice: number;
  sellAtPrice: number;
  spreadValue: number;
  spreadPercentage: number;
  maxBuyAmountWithVolume: number;
  maxSellAmountWithVolume: number;
}
