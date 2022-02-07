import makeSingletonFn from "../../utilities/createSingletonFunc";
import { wrapEndpointREST } from "../wrapEndpointREST";
import updateClient from "./updateClient/handler";

export default class ClientsEndpointsGraphQLController {
    public updateClient = wrapEndpointREST(updateClient);
}

export const getClientsEndpointsGraphQLController = makeSingletonFn(
    () => new ClientsEndpointsGraphQLController()
);
