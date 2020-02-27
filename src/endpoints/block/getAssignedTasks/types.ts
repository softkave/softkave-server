import { IBlock } from "../../../mongo/block";
import { IBaseEndpointContext } from "../../BaseEndpointContext";

export interface IGetAssignedTasksContext extends IBaseEndpointContext {
  getAssignedTasksFromStorage: () => Promise<IBlock[]>;
}

export interface IGetAssignedTasksResult {
  blocks: IBlock[];
}
