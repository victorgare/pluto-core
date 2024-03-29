import { Container } from "inversify";
import { TYPES } from "./types";
import dotenv = require("dotenv");
import { CollectController } from "./lib/controller/collectController";
import { AnalyzerService } from "./lib/service/analyzerService";
import { OpportunityRepository } from "./lib/repository/opportunityRepository";

dotenv.config();
const InversifyContainer = new Container();

InversifyContainer.bind<CollectController>(TYPES.CollectController).to(
  CollectController
);
InversifyContainer.bind<AnalyzerService>(TYPES.AnalyzerService).to(
  AnalyzerService
);

InversifyContainer.bind<OpportunityRepository>(TYPES.OpportunityRepository).to(
  OpportunityRepository
);

export { InversifyContainer };
