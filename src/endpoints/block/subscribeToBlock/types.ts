import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";

export interface ISubscribeToBlockParameters {
  blockId: string;
}

export type SubscribeToBlockEndpoint = Endpoint<
  IBaseContext,
  ISubscribeToBlockParameters
>;
