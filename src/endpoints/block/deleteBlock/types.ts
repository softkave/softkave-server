import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";

export interface IDeleteBlockParameters {
    blockId: string;
}

export type DeleteBlockEndpoint = Endpoint<
    IBaseContext,
    IDeleteBlockParameters
>;
