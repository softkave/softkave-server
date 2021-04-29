import makeSingletonFunc from "../../utilities/createSingletonFunc";

export default class ClientsEndpointsGraphQLController {}

export const getClientsEndpointsGraphQLController = makeSingletonFunc(
    () => new ClientsEndpointsGraphQLController()
);
