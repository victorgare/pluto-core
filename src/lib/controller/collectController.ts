import { ICollectController } from "../interfaces/controller/iCollectController";
import { injectable, inject } from "inversify";
import { BaseClass } from "../../archtype/base/baseClass";
import ccxt = require("ccxt");
import { IAnalyzerService } from "../interfaces/service/IAnalyzerService";
import { TYPES } from "../../types";

@injectable()
export class CollectController extends BaseClass implements ICollectController {
  private readonly _analyzerService: IAnalyzerService;

  constructor(
    @inject(TYPES.AnalyzerService) analyzerService: IAnalyzerService
  ) {
    super();
    this._analyzerService = analyzerService;
  }

  public async collect(): Promise<void> {
    const mercadoBtc: ccxt.Exchange = new ccxt.mercado();
    const braziliex: ccxt.Exchange = new ccxt.braziliex();
    const binance: ccxt.Exchange = new ccxt.binance();
    const binanceje: ccxt.Exchange = new ccxt.binanceje();
    const binanceus: ccxt.Exchange = new ccxt.binanceus();
    const kraken: ccxt.Exchange = new ccxt.kraken();
    const poloniex: ccxt.Exchange = new ccxt.poloniex();
    const hitbtc2: ccxt.Exchange = new ccxt.hitbtc2();
    const foxbit: ccxt.Exchange = new ccxt.foxbit();
    const coinmarketcap: ccxt.Exchange = new ccxt.coinmarketcap();
    const bittrex: ccxt.Exchange = new ccxt.bittrex();

    let exchanges = [
      mercadoBtc,
      braziliex,
      binance,
      binanceje,
      binanceus,
      kraken,
      poloniex,
      hitbtc2,
      foxbit,
      coinmarketcap,
      bittrex
    ];

    let lastExchange: ccxt.Exchange;
    debugger;
    for (const exchange of exchanges) {
      // a primeira iteracao nao fara analises
      if (!lastExchange) {
        lastExchange = exchange;
        continue;
      }

      // fara as analises
      await this._analyzerService.analyzeOpportunities(lastExchange, exchange);

      lastExchange = exchange;
    }
  }
}
