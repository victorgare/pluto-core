import { Context } from "@azure/functions";
import { InversifyContainer } from "../src/inversify.config";
import { ICollectController } from "../src/lib/interfaces/controller/iCollectController";
import { TYPES } from "../src/types";

export default function(context: Context, myTimer: any): Promise<void> {
  return InversifyContainer.get<ICollectController>(
    TYPES.CollectController
  ).collect();
}
