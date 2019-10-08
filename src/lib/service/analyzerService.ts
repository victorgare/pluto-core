import { IAnalyzerService } from "../interfaces/service/IAnalyzerService";
import { BaseClass } from "../../archtype/base/baseClass";
import ccxt = require("ccxt");
import { Opportunity } from "../domain/opportunity";
import { IOpportunityRepository } from "../interfaces/repository/IOpportunityRepository";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types";

const limit: number = 10;
@injectable()
export class AnalyzerService extends BaseClass implements IAnalyzerService {
  private readonly _opportunityRepository: IOpportunityRepository;

  /**
   *
   */
  constructor(
    @inject(TYPES.OpportunityRepository)
    opportunityRepository: IOpportunityRepository
  ) {
    super();
    this._opportunityRepository = opportunityRepository;
  }
  public async analyzeOpportunities(
    firstExchange: ccxt.Exchange,
    secondExchange: ccxt.Exchange
  ): Promise<void> {
    const pairs = Object.keys(await firstExchange.loadMarkets());

    try {
      for (const pair of pairs) {
        // só iremos trabalhar com pares com BRL e USD por enquanto
        if (
          pair.endsWith("BRL") ||
          pair.endsWith("USD") ||
          pair.endsWith("USDT")
        ) {
          const secondPair = (await secondExchange.loadMarkets())[pair];

          // só devemos fazer as analises, caso a segunda exchange possua o mesmo pair
          if (secondPair) {
            const firstPairOrderBook = await firstExchange.fetchOrderBook(
              secondPair.symbol,
              limit
            );
            const secondPairOrderBook = await secondExchange.fetchOrderBook(
              secondPair.symbol,
              limit
            );

            let result = await this.compareBooks(
              firstExchange,
              firstPairOrderBook,
              secondExchange,
              secondPairOrderBook,
              pair
            );

            // fazemos o inverso para ver as possibilidades tambem
            result.push(
              ...(await this.compareBooks(
                secondExchange,
                secondPairOrderBook,
                firstExchange,
                firstPairOrderBook,
                pair
              ))
            );

            if (result.length > 0) {
              // this._opportunityRepository.insertOpportunities(result);
            }
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  private async compareBooks(
    firstExchange: ccxt.Exchange,
    firstOrderBook: ccxt.OrderBook,
    secondExchange: ccxt.Exchange,
    secondOrderBook: ccxt.OrderBook,
    pair: string
  ): Promise<Opportunity[]> {
    const result: Opportunity[] = [];
    let bidIndex = 0;
    const splitedPair = pair.split("/");

    for (const ask of firstOrderBook.asks) {
      const bid = secondOrderBook.bids[bidIndex];

      // faz as validacoes se o bid e o ask estao OK
      if (!bid || !ask || bid.length < 2 || ask.length < 2) {
        continue;
      }

      // só deve continuar se o preco de compra for menor que o preco de venda
      // e a diferenca de preco tem q ser maior que 10
      const priceAsk = ask[0];
      const priceBid = bid[0];
      const volumeAsk = ask[1];
      const volumeBid = bid[1];

      // essas linhas são da versao antiga
      const difference = priceBid - priceAsk;
      const percentage =
        ((priceBid - priceAsk) / ((priceAsk + priceBid) / 2)) * 100;

      if (difference > 10 || percentage > 1) {
        // o volume o ask deve ser maior que o volume do bid
        if (volumeAsk >= volumeBid) {
          result.push(
            new Opportunity({
              buyCoin: splitedPair[0],
              sellCoin: splitedPair[1],
              butAtPrice: priceAsk,
              sellAtPrice: priceBid,
              spreadValue: difference,
              spreadPercentage: percentage,
              buyAtExchange: firstExchange.name,
              sellAtExchange: secondExchange.name
            })
          );
        }
      }

      bidIndex++;
    }

    return result;
  }
}
