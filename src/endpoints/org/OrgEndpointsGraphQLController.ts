import makeSingletonFunc from "../../utilities/createSingletonFunc";
import { getBaseContext } from "../contexts/BaseContext";
import RequestData from "../RequestData";
import { wrapEndpoint } from "../utils";
import createOrg from "./createOrg/handler";
import getUserOrgs from "./getUserOrgs/handler";
import updateOrg from "./updateOrg/handler";
import orgExists from "./orgExists/handler";

export default class OrgEndpointsGraphQLController {
    public async updateOrg(data, req) {
        // @ts-ignore
        const instData = RequestData.fromExpressRequest(
            getBaseContext(),
            req,
            data
        );

        return wrapEndpoint(data, req, async () =>
            updateOrg(getBaseContext(), instData)
        );
    }

    public createOrg(data, req) {
        return wrapEndpoint(data, req, async () =>
            createOrg(
                getBaseContext(),
                await RequestData.fromExpressRequest(
                    getBaseContext(),
                    req,
                    data
                )
            )
        );
    }

    public orgExists(data, req) {
        return wrapEndpoint(data, req, async () =>
            orgExists(
                getBaseContext(),
                await RequestData.fromExpressRequest(
                    getBaseContext(),
                    req,
                    data
                )
            )
        );
    }

    public getUserOrgs(data, req) {
        return wrapEndpoint(data, req, async () =>
            getUserOrgs(
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

export const getBlockEndpointsGraphQLController = makeSingletonFunc(
    () => new OrgEndpointsGraphQLController()
);
