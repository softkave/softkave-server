import { IBaseEndpointContext } from "endpoints/BaseEndpointContext";
import { IBlock } from "mongo/block";

// tslint:disable-next-line: no-empty-interface
export interface IGetAssignedTasksContext extends IBaseEndpointContext {
  getAssignedTasksFromDatabase: () => Promise<IBlock[]>;
}

export interface IGetAssignedTasksResult {
  blocks: IBlock[];
}
