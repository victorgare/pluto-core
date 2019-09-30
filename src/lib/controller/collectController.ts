import { ICollectController } from "../interfaces/controller/iCollectController";
import { injectable } from "inversify";
import { BaseClass } from "../../archtype/base/baseClass";
import ccxt = require("ccxt");

@injectable()
export class CollectController extends BaseClass implements ICollectController {
  public async collect(): Promise<void> {
    const mercadoBtc: ccxt.Exchange = new ccxt.mercado();
    const braziliex: ccxt.Exchange = new ccxt.braziliex();

    let exchanges = [mercadoBtc, braziliex];

    let lastExchange: ccxt.Exchange;
    debugger;
    for (const exchange of exchanges) {
      // a primeira iteracao nao fara analises
      if (!lastExchange) {
        lastExchange = exchange;
        continue;
      }

      const pairs = Object.keys(await lastExchange.loadMarkets());

      for (const pair of pairs) {
        // só iremos trabalhar com pares com BRL por enquanto
        if (pair.includes("BRL")) {
          debugger;
          const secondPair = (await exchange.loadMarkets())[pair];
          debugger;
          // só devemos fazer as analises, caso a segunda exchange possua o mesmo pair
          if (secondPair) {
            debugger;
            const firstPairOrderBook = await lastExchange.fetchOrderBook(
              secondPair.symbol
            );
            const secondPairOrderBook = await exchange.fetchOrderBook(
              secondPair.symbol
            );
            debugger;
          }
        }
      }

      lastExchange = exchange;
    }
  }
}
