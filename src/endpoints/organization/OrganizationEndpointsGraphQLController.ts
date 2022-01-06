import makeSingletonFn from "../../utilities/createSingletonFunc";
import { wrapEndpointREST } from "../utils";
import createOrganization from "./createOrganization/handler";
import getUserOrganizations from "./getUserOrganizations/handler";
import updateOrganization from "./updateOrganization/handler";
import organizationExists from "./organizationExists/handler";

export default class OrganizationEndpointsGraphQLController {
    public updateOrganization = wrapEndpointREST(updateOrganization);
    public createOrganization = wrapEndpointREST(createOrganization);
    public organizationExists = wrapEndpointREST(organizationExists);
    public getUserOrganizations = wrapEndpointREST(getUserOrganizations);
}

export const getOrganizationEndpointsGraphQLController = makeSingletonFn(
    () => new OrganizationEndpointsGraphQLController()
);
