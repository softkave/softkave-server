import { IBaseContext } from "../../contexts/IBaseContext";
import { Endpoint } from "../../types";

export interface IMarkRequestReadParameters {
    requestId: string;
}

export type MarkRequestReadEndpoint = Endpoint<
    IBaseContext,
    IMarkRequestReadParameters
>;
