import { IBaseRepository } from "../../../archtype/interfaces/IBaseRepository";
import { Opportunity } from "../../domain/opportunity";

export interface IOpportunityRepository extends IBaseRepository {
  insertOpportunities(opportunities: Opportunity[]): Promise<void>;
}
