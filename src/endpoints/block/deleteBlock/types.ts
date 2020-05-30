import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";

export interface IDeleteBlockParameters {
  customId: string;
}

export type DeleteBlockEndpoint = Endpoint<
  IBaseContext,
  IDeleteBlockParameters
>;
