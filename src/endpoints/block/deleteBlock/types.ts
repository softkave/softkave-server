import { IBaseContext } from "../../contexts/IBaseContext";
import { Endpoint } from "../../types";

export interface IDeleteBlockParameters {
    blockId: string;
}

export type DeleteBlockEndpoint = Endpoint<
    IBaseContext,
    IDeleteBlockParameters
>;
