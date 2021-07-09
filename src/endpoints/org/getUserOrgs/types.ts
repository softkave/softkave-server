import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";
import { IPublicOrg } from "../types";

export interface IGetUserOrgsResult {
    orgs: IPublicOrg[];
}

export type GetUserOrgsEndpoint = Endpoint<
    IBaseContext,
    undefined,
    IGetUserOrgsResult
>;
