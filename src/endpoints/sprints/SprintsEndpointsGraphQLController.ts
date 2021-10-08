import makeSingletonFn from "../../utilities/createSingletonFunc";
import { getBaseContext } from "../contexts/BaseContext";
import RequestData from "../RequestData";
import { wrapEndpoint } from "../utils";
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
    public addSprint(data, req) {
        return wrapEndpoint(data, req, async () =>
            addSprint(
                getBaseContext(),
                await RequestData.fromExpressRequest(
                    getBaseContext(),
                    req,
                    data
                )
            )
        );
    }

    public deleteSprint(data, req) {
        return wrapEndpoint(data, req, async () =>
            deleteSprint(
                getBaseContext(),
                await RequestData.fromExpressRequest(
                    getBaseContext(),
                    req,
                    data
                )
            )
        );
    }

    public sprintExists(data, req) {
        return wrapEndpoint(data, req, async () =>
            sprintExists(
                getBaseContext(),
                await RequestData.fromExpressRequest(
                    getBaseContext(),
                    req,
                    data
                )
            )
        );
    }

    public getSprints(data, req) {
        return wrapEndpoint(data, req, async () =>
            getSprints(
                getBaseContext(),
                await RequestData.fromExpressRequest(
                    getBaseContext(),
                    req,
                    data
                )
            )
        );
    }

    public setupSprints(data, req) {
        return wrapEndpoint(data, req, async () =>
            setupSprints(
                getBaseContext(),
                await RequestData.fromExpressRequest(
                    getBaseContext(),
                    req,
                    data
                )
            )
        );
    }

    public startSprint(data, req) {
        return wrapEndpoint(data, req, async () =>
            startSprint(
                getBaseContext(),
                await RequestData.fromExpressRequest(
                    getBaseContext(),
                    req,
                    data
                )
            )
        );
    }

    public endSprint(data, req) {
        return wrapEndpoint(data, req, async () =>
            endSprint(
                getBaseContext(),
                await RequestData.fromExpressRequest(
                    getBaseContext(),
                    req,
                    data
                )
            )
        );
    }

    public updateSprintOptions(data, req) {
        return wrapEndpoint(data, req, async () =>
            updateSprintOptions(
                getBaseContext(),
                await RequestData.fromExpressRequest(
                    getBaseContext(),
                    req,
                    data
                )
            )
        );
    }

    public updateSprint(data, req) {
        return wrapEndpoint(data, req, async () =>
            updateSprint(
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

export const getSprintsEndpointsGraphQLController = makeSingletonFn(
    () => new SprintsEndpointsGraphQLController()
);
