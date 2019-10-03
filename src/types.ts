import "reflect-metadata";

const TYPES = {
  CollectController: Symbol.for("ICollectController"),
  AnalyzerService: Symbol.for("IAnalyzerService"),
  OpportunityRepository: Symbol.for("IOpportunityRepository")
};

export { TYPES };
