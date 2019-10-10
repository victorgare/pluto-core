import { IAnalyzerService } from "../interfaces/service/IAnalyzerService";
import { BaseClass } from "../../archtype/base/baseClass";
import ccxt = require("ccxt");
import { Opportunity } from "../domain/opportunity";
import { IOpportunityRepository } from "../interfaces/repository/IOpportunityRepository";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types";
import { Analyze } from "../domain/analyze";
import { OrderBook } from "../domain/orderBook";

const limit: number = 10;
@injectable()
export class AnalyzerService extends BaseClass implements IAnalyzerService {
  private readonly _opportunityRepository: IOpportunityRepository;

  constructor(
    @inject(TYPES.OpportunityRepository)
    opportunityRepository: IOpportunityRepository
  ) {
    super();
    this._opportunityRepository = opportunityRepository;
  }

  public async getInfo(exchange: ccxt.Exchange): Promise<Analyze> {
    const markets = await exchange.loadMarkets();
    const marketsKeys = Object.keys(markets).filter(item => {
      return (
        item.endsWith("/BRL") || item.endsWith("/USD") || item.endsWith("/USDT")
      );
    });

    let ordersBooks: OrderBook[] = [];
    for (const marketKey of marketsKeys) {
      const market = markets[marketKey];
      if (market) {
        const orderBook = await exchange.fetchOrderBook(market.symbol, limit);
        ordersBooks.push(<OrderBook>{
          market: markets,
          marketKey: marketKey,
          orderBook: orderBook
        });
      }
    }

    return new Analyze({
      exchange,
      orderBook: ordersBooks
    });
  }

  public async analyzeOpportunities(
    firstEntry: Analyze,
    secondEntry: Analyze
  ): Promise<void> {
    let result: Opportunity[] = [];

    for (const firstEntryOrderBook of firstEntry.orderBook) {
      for (const ask of firstEntryOrderBook.orderBook.asks) {
        if (!ask && ask.length < 2 && ask[1] <= 0) {
          continue;
        }
        // encontra o orderbook baseado no pair
        const secondEntryOrderBook = secondEntry.orderBook.find(item => {
          return item.marketKey === firstEntryOrderBook.marketKey;
        });

        // só continua se encontrou o pair
        if (secondEntryOrderBook) {
          for (const bid of secondEntryOrderBook.orderBook.bids) {
            if (!bid && bid.length < 2 && bid[1] <= 0) {
              continue;
            }

            const priceAsk = ask[0];
            const priceBid = bid[0];
            const volumeAsk = ask[1];
            const volumeBid = bid[1];

            const minVolume = Math.min(volumeAsk, volumeBid);
            const maxBuy = priceAsk * minVolume;
            const maxSell = priceBid * minVolume;
            const difference = maxSell - maxBuy;
            const percentage =
              ((maxSell - maxBuy) / ((maxBuy + maxSell) / 2)) * 100;

            if (difference > 10 || (percentage > 1 && difference > 0)) {
              // remove o volume do ASK do bid para que nao interfira nas proximas analises
              bid[1] = volumeBid - volumeAsk;

              const splitedPair = firstEntryOrderBook.marketKey.split("/");
              result.push(
                new Opportunity({
                  buyCoin: splitedPair[0],
                  sellCoin: splitedPair[1],
                  buyAtPrice: priceAsk,
                  sellAtPrice: priceBid,
                  spreadValue: difference,
                  spreadPercentage: percentage,
                  buyAtExchange: firstEntry.exchange.name,
                  sellAtExchange: secondEntry.exchange.name,
                  maxBuyAmountWithVolume: maxBuy,
                  maxSellAmountWithVolume: maxSell
                })
              );
            }
          }
        }
      }
    }

    if (result.length > 0) {
      this._opportunityRepository.insertOpportunities(result);
    }
  }
}
