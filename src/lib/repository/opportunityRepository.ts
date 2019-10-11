import { BaseRepository } from "../../archtype/base/baseRepository";
import { IOpportunityRepository } from "../interfaces/repository/IOpportunityRepository";
import { Opportunity } from "../domain/opportunity";
import { injectable } from "inversify";

@injectable()
export class OpportunityRepository extends BaseRepository
  implements IOpportunityRepository {
  private readonly _document: firebase.firestore.DocumentReference;
  /**
   *
   */
  constructor() {
    super();

    this._document = this._collection.doc("opportunities");
  }

  public async insertOpportunities(
    opportunities: Opportunity[]
  ): Promise<void> {
    debugger;
    for (const opportunity of opportunities) {
      this._document
        .collection("opportunities")
        .add(Object.assign({}, opportunity));
    }
  }
}
