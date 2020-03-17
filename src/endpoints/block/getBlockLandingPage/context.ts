import { BlockLandingPage, IBlock } from "../../../mongo/block";
import waitOnPromises from "../../../utilities/waitOnPromises";
import BaseEndpointContext, {
  IBaseEndpointContextParameters
} from "../../BaseEndpointContext";
import { wrapDBCall } from "../../utils";
import {
  IGetBlockLandingPageContext,
  IGetBlockLandingPageParameters
} from "./types";

export interface IGetBlockLandingPageContextParameters
  extends IBaseEndpointContextParameters {
  data: IGetBlockLandingPageParameters;
}

export default class GetBlockLandingPageContext extends BaseEndpointContext
  implements IGetBlockLandingPageContext {
  public data: IGetBlockLandingPageParameters;

  constructor(p: IGetBlockLandingPageContextParameters) {
    super(p);
    this.data = p.data;
  }

  public async queryBlockLandingInDB(block: IBlock): Promise<BlockLandingPage> {
    return wrapDBCall(this._queryBlockLandingInDB.bind(this), block);
  }

  private async _queryBlockLandingInDB(
    block: IBlock
  ): Promise<BlockLandingPage> {
    const baseQuery: any = {
      parent: { $in: block.groups }
    };

    if (block.type !== "org") {
      baseQuery.rootBlockID = block.rootBlockID;
    }

    const taskQuery = { ...baseQuery, type: "task" };
    const projectQuery = { ...baseQuery, type: "project" };
    const taskQueryPromise = this.blockModel.model.findOne(taskQuery).exec();
    const projectQueryPromise = this.blockModel.model
      .findOne(projectQuery)
      .exec();
    const result = await waitOnPromises([
      { promise: taskQueryPromise, id: "task" },
      { promise: projectQueryPromise, id: "project" }
    ]);

    let hasTask = false;
    let hasProject = false;

    result.map(fulfilledPromise => {
      switch (fulfilledPromise.id) {
        case "task":
          hasTask = !!fulfilledPromise.value;
          break;

        case "project":
          hasProject = !!fulfilledPromise.value;
          break;
      }
    });

    if (hasTask) {
      return "tasks";
    } else if (hasProject) {
      return "projects";
    }

    return "self";
  }
}
