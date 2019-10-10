import { ICollectController } from "../interfaces/controller/iCollectController";
import { injectable, inject } from "inversify";
import { BaseClass } from "../../archtype/base/baseClass";
import ccxt = require("ccxt");
import { IAnalyzerService } from "../interfaces/service/IAnalyzerService";
import { TYPES } from "../../types";
import { Analyze } from "../domain/analyze";

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
    // const mercadoBtc: ccxt.Exchange = new ccxt.mercado();
    // const braziliex: ccxt.Exchange = new ccxt.braziliex();
    // const foxbit: ccxt.Exchange = new ccxt.foxbit();
    const binance: ccxt.Exchange = new ccxt.binance();
    const binanceje: ccxt.Exchange = new ccxt.binanceje();
    const binanceus: ccxt.Exchange = new ccxt.binanceus();
    const kraken: ccxt.Exchange = new ccxt.kraken();
    const poloniex: ccxt.Exchange = new ccxt.poloniex();
    const hitbtc2: ccxt.Exchange = new ccxt.hitbtc2();

    const bittrex: ccxt.Exchange = new ccxt.bittrex();

    let exchanges = [
      // mercadoBtc
      // braziliex,
      // foxbit,
      binance,
      binanceje,
      binanceus,
      kraken,
      poloniex,
      hitbtc2,
      bittrex
    ];

    let resultPromises: Promise<Analyze>[] = [];
    for (const exchange of exchanges) {
      resultPromises.push(this._analyzerService.getInfo(exchange));
    }

    const analyzes = await Promise.all(resultPromises);

    let promises: Promise<void>[] = [];
    for (const firstAnalyze of analyzes) {
      for (const secondAnalyze of analyzes) {
        if (firstAnalyze.exchange.name !== secondAnalyze.exchange.name) {
          promises.push(
            this._analyzerService.analyzeOpportunities(
              firstAnalyze,
              secondAnalyze
            )
          );
        }
      }
    }

    await Promise.all(promises);
  }
}
