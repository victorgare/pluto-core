import { Context } from "@azure/functions";

const df = require("durable-functions");

export default async function(context: Context, myTimer: any): Promise<void> {
  try {
    const client = df.getClient(context);
    const instanceId = await client.startNew(
      "orchestrator",
      "myGetInfoOrchestrator"
    );

    context.log(`Started orchestration with ID = '${instanceId}'.`);
  } catch (error) {
    context.log(`ERROR ${error}`);
  }
}
