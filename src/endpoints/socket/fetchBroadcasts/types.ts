import { IBaseContext } from "../../contexts/BaseContext";
import { IBroadcastHistoryFetchResult } from "../../contexts/BroadcastHistoryContext";
import { Endpoint } from "../../types";

export interface IFetchBroadcastsParameters {
  from: string;
  rooms: string[];
}

export type FetchBroadcastsEndpoint = Endpoint<
  IBaseContext,
  IFetchBroadcastsParameters,
  IBroadcastHistoryFetchResult
>;