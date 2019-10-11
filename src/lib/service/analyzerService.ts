import { IAnalyzerService } from "../interfaces/service/IAnalyzerService";
import { BaseClass } from "../../archtype/base/baseClass";
import ccxt = require("ccxt");
import { Opportunity } from "../domain/opportunity";
import { IOpportunityRepository } from "../interfaces/repository/IOpportunityRepository";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types";
import { Analyze } from "../domain/analyze";
import { OrderBook } from "../domain/orderBook";
import fs = require("fs");

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
        (item.endsWith("/BRL") ||
          item.endsWith("/USD") ||
          item.endsWith("/USDT")) &&
        !(
          item.startsWith("BRL/") ||
          item.startsWith("USD/") ||
          item.startsWith("USDT/")
        )
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
        if (!ask && ask.length < 2) {
          continue;
        }
        // encontra o orderbook baseado no pair
        const secondEntryOrderBook = secondEntry.orderBook.find(item => {
          return item.marketKey === firstEntryOrderBook.marketKey;
        });

        // só continua se encontrou o pair
        if (secondEntryOrderBook) {
          for (const bid of secondEntryOrderBook.orderBook.bids) {
            if (!bid && bid.length < 2) {
              continue;
            }

            const priceAsk = ask[0];
            const priceBid = bid[0];
            const volumeAsk = ask[1];
            const volumeBid = bid[1];
            const askFee = Number.parseFloat(
              firstEntryOrderBook.market[firstEntryOrderBook.marketKey].taker
            );
            const bidFee = Number.parseFloat(
              secondEntryOrderBook.market[secondEntryOrderBook.marketKey].taker
            );

            // ignora caso algum dos valores seja menor que zero
            if (
              priceAsk < 0 ||
              priceBid < 0 ||
              volumeAsk < 0 ||
              volumeBid < 0
            ) {
              continue;
            }

            const splitedPair = firstEntryOrderBook.marketKey.split("/");
            const minVolume = Math.min(volumeAsk, volumeBid);
            const maxBuy = priceAsk * minVolume;
            const maxSell = priceBid * minVolume;
            const feeAskValue = priceAsk * (minVolume * askFee);
            const feeBidValue = priceBid * (minVolume * bidFee);

            const transferFee =
              maxBuy *
              (minVolume *
                (firstEntry.exchange.currencies[splitedPair[0]]["fee"] || 0));

            const difference =
              maxSell - maxBuy - feeAskValue - feeBidValue - transferFee;

            const percentage =
              ((maxSell - maxBuy) / ((maxBuy + maxSell) / 2)) * 100;

            // o valor tem que ser maior q 5 dolares de spread
            if (difference > 5) {
              // remove o volume do ASK do bid para que nao interfira nas proximas analises
              bid[1] = volumeBid - volumeAsk;

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
                  maxSellAmountWithVolume: maxSell,
                  volume: minVolume,
                  feeBuy: feeAskValue,
                  feeSell: feeBidValue,
                  transferFee: transferFee
                })
              );
            }
          }
        }
      }
    }

    if (result.length > 0) {
      // debugger;
      // const rawData = fs.readFileSync("data.json").toString();
      // const data = <any[]>JSON.parse(rawData);

      // data.push(...result);

      // fs.writeFileSync("data.json", JSON.stringify(data));
      await this._opportunityRepository.insertOpportunities(result);
    }
  }
}
