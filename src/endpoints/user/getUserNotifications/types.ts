import { INotification } from "../../../mongo/notification";
import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";

export interface IGetCollaborationRequestsResult {
  requests: INotification[];
}

export type GetCollaborationRequestsEndpoint = Endpoint<
  IBaseContext,
  undefined,
  IGetCollaborationRequestsResult
>;
