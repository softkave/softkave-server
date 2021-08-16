import getSingletonFunc from "../../utilities/createSingletonFunc";
import { getBaseContext } from "../contexts/BaseContext";
import RequestData from "../RequestData";
import { wrapEndpoint } from "../utils";
import createOption from "./createOption/handler";

export default class CustomPropertyEndpointsGraphQLController {
    public async createOption(data, req) {
        // @ts-ignore
        const instData = RequestData.fromExpressRequest(
            getBaseContext(),
            req,
            data
        );

        return wrapEndpoint(data, req, async () =>
            createOption(getBaseContext(), instData)
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

export const getCustomPropertyEndpointsGraphQLController = getSingletonFunc(
    () => new CustomPropertyEndpointsGraphQLController()
);
