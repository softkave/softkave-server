import { IBaseEndpointContext } from "endpoints/BaseEndpointContext";
import { IBlock } from "mongo/block";

export interface IGetAssignedTasksContext extends IBaseEndpointContext {
  getAssignedTasksFromStorage: () => Promise<IBlock[]>;
}

export interface IGetAssignedTasksResult {
  blocks: IBlock[];
}
