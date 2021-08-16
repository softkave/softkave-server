import getSingletonFunc from "../../utilities/createSingletonFunc";
import { getBaseContext } from "../contexts/BaseContext";
import RequestData from "../RequestData";
import { wrapEndpoint } from "../utils";
import updateClient from "./updateClient/handler";

export default class ClientsEndpointsGraphQLController {
    public updateClient(data, req) {
        return wrapEndpoint(data, req, async () =>
            // @ts-ignore
            updateClient(
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

export const getClientsEndpointsGraphQLController = getSingletonFunc(
    () => new ClientsEndpointsGraphQLController()
);
