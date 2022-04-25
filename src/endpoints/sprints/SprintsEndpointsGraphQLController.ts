import makeSingletonFn from "../../utilities/createSingletonFunc";
import { wrapEndpointREST } from "../wrapEndpointREST";
import addSprint from "./addSprint/addSprint";
import deleteSprint from "./deleteSprint/deleteSprint";
import getSprints from "./getSprints/getSprints";
import sprintExists from "./sprintExists/sprintExists";
import updateSprint from "./updateSprint/updateSprint";

export default class SprintsEndpointsGraphQLController {
    public addSprint = wrapEndpointREST(addSprint);
    public deleteSprint = wrapEndpointREST(deleteSprint);
    public sprintExists = wrapEndpointREST(sprintExists);
    public getSprints = wrapEndpointREST(getSprints);
    public updateSprint = wrapEndpointREST(updateSprint);
}

export const getSprintsEndpointsGraphQLController = makeSingletonFn(
    () => new SprintsEndpointsGraphQLController()
);
