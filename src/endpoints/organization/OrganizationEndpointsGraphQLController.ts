import getSingletonFunc from "../../utilities/createSingletonFunc";
import { getBaseContext } from "../contexts/BaseContext";
import RequestData from "../RequestData";
import { wrapEndpoint } from "../utils";
import createOrganization from "./createOrganization/handler";
import getUserOrganizations from "./getUserOrganizations/handler";
import updateOrganization from "./updateOrganization/handler";
import organizationExists from "./organizationExists/handler";

export default class OrganizationEndpointsGraphQLController {
    public async updateOrganization(data, req) {
        // @ts-ignore
        const instData = RequestData.fromExpressRequest(
            getBaseContext(),
            req,
            data
        );

        return wrapEndpoint(data, req, async () =>
            updateOrganization(getBaseContext(), instData)
        );
    }

    public createOrganization(data, req) {
        return wrapEndpoint(data, req, async () =>
            createOrganization(
                getBaseContext(),
                await RequestData.fromExpressRequest(
                    getBaseContext(),
                    req,
                    data
                )
            )
        );
    }

    public organizationExists(data, req) {
        return wrapEndpoint(data, req, async () =>
            organizationExists(
                getBaseContext(),
                await RequestData.fromExpressRequest(
                    getBaseContext(),
                    req,
                    data
                )
            )
        );
    }

    public getUserOrganizations(data, req) {
        return wrapEndpoint(data, req, async () =>
            getUserOrganizations(
                getBaseContext(),
                await RequestData.fromExpressRequest(
                    getBaseContext(),
                    req,
                    data
                )
            )
        );
    }
}

export const getOrganizationEndpointsGraphQLController = getSingletonFunc(
    () => new OrganizationEndpointsGraphQLController()
);
