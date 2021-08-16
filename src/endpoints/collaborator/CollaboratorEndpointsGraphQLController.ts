import getSingletonFunc from "../../utilities/createSingletonFunc";
import { getBaseContext } from "../contexts/BaseContext";
import RequestData from "../RequestData";
import { wrapEndpoint } from "../utils";
import getOrganizationCollaborators from "./getOrganizationCollaborators/handler";
import removeCollaborator from "./removeCollaborator/handler";

export default class CollaboratorEndpointsGraphQLController {
    public getOrganizationCollaborators(data, req) {
        return wrapEndpoint(data, req, async () =>
            // @ts-ignore
            getOrganizationCollaborators(
                getBaseContext(),
                await RequestData.fromExpressRequest(
                    getBaseContext(),
                    req,
                    data
                )
            )
        );
    }

    public removeCollaborator(data, req) {
        return wrapEndpoint(data, req, async () =>
            removeCollaborator(
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

export const getCollaboratorEndpointsGraphQLController = getSingletonFunc(
    () => new CollaboratorEndpointsGraphQLController()
);
