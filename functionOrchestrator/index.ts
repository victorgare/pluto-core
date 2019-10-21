import * as df from "durable-functions";

import ccxt = require("ccxt");

const orchestrator = df.orchestrator(function*(context) {
  try {
    // const mercadoBtc: ccxt.Exchange = new ccxt.mercado();
    // const braziliex: ccxt.Exchange = new ccxt.braziliex();
    // const foxbit: ccxt.Exchange = new ccxt.foxbit();
    // const binance: ccxt.Exchange = new ccxt.binance();
    // const binanceje: ccxt.Exchange = new ccxt.binanceje();
    // const binanceus: ccxt.Exchange = new ccxt.binanceus();
    // const kraken: ccxt.Exchange = new ccxt.kraken();
    // const poloniex: ccxt.Exchange = new ccxt.poloniex();
    // const hitbtc2: ccxt.Exchange = new ccxt.hitbtc2();

    // const bittrex: ccxt.Exchange = new ccxt.bittrex();

    // let exchanges = [
    //   // mercadoBtc
    //   // braziliex,
    //   // foxbit,
    //   binance,
    //   binanceje,
    //   binanceus,
    //   kraken,
    //   poloniex,
    //   hitbtc2,
    //   bittrex
    // ];
    let exchanges = [
      "binance",
      "binanceje",
      "binanceus",
      "kraken",
      "poloniex",
      "hitbtc2",
      "bittrex"
    ];

    // let resultPromises: Promise<Analyze>[] = [];
    const tasks = [];
    for (const exchange of exchanges) {
      tasks.push(context.df.callActivity("getInfo", exchange));
    }

    const results = yield context.df.Task.all(tasks);

    debugger;
  } catch (error) {
    debugger;
  }
});

export default orchestrator;
