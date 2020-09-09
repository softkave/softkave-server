import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";

export interface IGetGroupListParameters {
    orgId: string;
}

export type GroupListEndpoint = Endpoint<IBaseContext, IGetGroupListParameters>;
