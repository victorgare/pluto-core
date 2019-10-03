import { BaseEntity } from "../../archtype/base/baseEntity";

export class Opportunity extends BaseEntity {
  buyAtExchange: string;
  sellAtExchange: string;
  buyCoin: string;
  sellCoin: string;
  butAtPrice: number;
  sellAtPrice: number;
  spreadValue: number;
  spreadPercentage: number;
}
