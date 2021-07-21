import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";
import { IPublicOrganization } from "../types";

export interface IGetUserOrganizationsResult {
    organizations: IPublicOrganization[];
}

export type GetUserOrganizationsEndpoint = Endpoint<
    IBaseContext,
    undefined,
    IGetUserOrganizationsResult
>;
