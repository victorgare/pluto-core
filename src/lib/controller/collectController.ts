import { ICollectController } from "../interfaces/controller/iCollectController";
import { injectable, inject } from "inversify";
import { BaseClass } from "../../archtype/base/baseClass";
import { IAnalyzerService } from "../interfaces/service/IAnalyzerService";
import { TYPES } from "../../types";
import { Analyze } from "../domain/analyze";
import { Context } from "@azure/functions";
import ccxt = require("ccxt");

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
    // const analyzes = await Promise.all(resultPromises);
    // let promises: Promise<void>[] = [];
    // for (const firstAnalyze of analyzes) {
    //   for (const secondAnalyze of analyzes) {
    //     if (firstAnalyze.exchange.name !== secondAnalyze.exchange.name) {
    //       promises.push(
    //         this._analyzerService.analyzeOpportunities(
    //           firstAnalyze,
    //           secondAnalyze
    //         )
    //       );
    //     }
    //   }
    // }
    // await Promise.all(promises);
  }

  public async getInfo(exchangeId: string): Promise<Analyze> {
    const exchange = new ccxt[exchangeId]();
    return this._analyzerService.getInfo(exchange);
  }
}
