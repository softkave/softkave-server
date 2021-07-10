import makeSingletonFunc from "../../utilities/createSingletonFunc";
import { getBaseContext } from "../contexts/BaseContext";
import RequestData from "../RequestData";
import { wrapEndpoint } from "../utils";
import getOrgCollaborators from "./getOrgCollaborators/handler";
import removeCollaborator from "./removeCollaborator/handler";

export default class CollaboratorEndpointsGraphQLController {
    public getOrgCollaborators(data, req) {
        return wrapEndpoint(data, req, async () =>
            // @ts-ignore
            getOrgCollaborators(
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

export const getCollaboratorEndpointsGraphQLController = makeSingletonFunc(
    () => new CollaboratorEndpointsGraphQLController()
);
