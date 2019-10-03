import { BaseRepository } from "../../archtype/base/baseRepository";
import { IOpportunityRepository } from "../interfaces/repository/IOpportunityRepository";
import { Opportunity } from "../domain/opportunity";
import { injectable } from "inversify";

@injectable()
export class OpportunityRepository extends BaseRepository
  implements IOpportunityRepository {
  private readonly _collection: firebase.firestore.CollectionReference;
  /**
   *
   */
  constructor() {
    super();
    this._collection = this._firestore.collection("opportunities");
  }

  public async insertOpportunities(
    opportunities: Opportunity[]
  ): Promise<void> {
    for (const opportunity of opportunities) {
      this._collection.add(opportunity);
    }
  }
}
