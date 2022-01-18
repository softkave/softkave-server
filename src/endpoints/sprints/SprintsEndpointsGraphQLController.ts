import makeSingletonFn from "../../utilities/createSingletonFunc";
import { wrapEndpointREST } from "../wrapEndpointREST";
import addSprint from "./addSprint/addSprint";
import deleteSprint from "./deleteSprint/deleteSprint";
import endSprint from "./endSprint/endSprint";
import getSprints from "./getSprints/getSprints";
import setupSprints from "./setupSprints/setupSprints";
import sprintExists from "./sprintExists/sprintExists";
import startSprint from "./startSprint/startSprint";
import updateSprint from "./updateSprint/updateSprint";
import updateSprintOptions from "./updateSprintOptions/updateSprintOptions";

export default class SprintsEndpointsGraphQLController {
    public addSprint = wrapEndpointREST(addSprint);
    public deleteSprint = wrapEndpointREST(deleteSprint);
    public sprintExists = wrapEndpointREST(sprintExists);
    public getSprints = wrapEndpointREST(getSprints);
    public setupSprints = wrapEndpointREST(setupSprints);
    public startSprint = wrapEndpointREST(startSprint);
    public endSprint = wrapEndpointREST(endSprint);
    public updateSprintOptions = wrapEndpointREST(updateSprintOptions);
    public updateSprint = wrapEndpointREST(updateSprint);
}

export const getSprintsEndpointsGraphQLController = makeSingletonFn(
    () => new SprintsEndpointsGraphQLController()
);
