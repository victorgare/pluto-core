import { AzureFunction, Context } from "@azure/functions";
import ccxt = require("ccxt");
import { InversifyContainer } from "../src/inversify.config";
import { ICollectController } from "../src/lib/interfaces/controller/iCollectController";
import { TYPES } from "../src/types";
import { Analyze } from "../src/lib/domain/analyze";

const activityFunction: AzureFunction = async function(
  context: Context,
  exchangeId: string
): Promise<Analyze> {
  try {
    const result = await InversifyContainer.get<ICollectController>(
      TYPES.CollectController
    ).getInfo(exchangeId);

    return result;
  } catch (error) {
    debugger;
  }
};

export default activityFunction;
