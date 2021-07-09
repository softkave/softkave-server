import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";

export interface IOrgExistsParameters {
    name: string;
}

export interface IOrgExistsResult {
    exists: boolean;
}

export type OrgExistsEndpoint = Endpoint<
    IBaseContext,
    IOrgExistsParameters,
    IOrgExistsResult
>;
