import { getBaseContext } from "../contexts/BaseContext";
import RequestData from "../contexts/RequestData";
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

export default class SprintController {
    public addSprint(data, req) {
        return wrapEndpoint(data, req, () =>
            addSprint(
                getBaseContext(),
                RequestData.fromExpressRequest(req, data)
            )
        );
    }

    public deleteSprint(data, req) {
        return wrapEndpoint(data, req, () =>
            deleteSprint(
                getBaseContext(),
                RequestData.fromExpressRequest(req, data)
            )
        );
    }

    public sprintExists(data, req) {
        return wrapEndpoint(data, req, () =>
            sprintExists(
                getBaseContext(),
                RequestData.fromExpressRequest(req, data)
            )
        );
    }

    public getSprints(data, req) {
        return wrapEndpoint(data, req, () =>
            getSprints(
                getBaseContext(),
                RequestData.fromExpressRequest(req, data)
            )
        );
    }

    public setupSprints(data, req) {
        return wrapEndpoint(data, req, () =>
            setupSprints(
                getBaseContext(),
                RequestData.fromExpressRequest(req, data)
            )
        );
    }

    public startSprint(data, req) {
        return wrapEndpoint(data, req, () =>
            startSprint(
                getBaseContext(),
                RequestData.fromExpressRequest(req, data)
            )
        );
    }

    public endSprint(data, req) {
        return wrapEndpoint(data, req, () =>
            endSprint(
                getBaseContext(),
                RequestData.fromExpressRequest(req, data)
            )
        );
    }

    public updateSprintOptions(data, req) {
        return wrapEndpoint(data, req, () =>
            updateSprintOptions(
                getBaseContext(),
                RequestData.fromExpressRequest(req, data)
            )
        );
    }

    public updateSprint(data, req) {
        return wrapEndpoint(data, req, () =>
            updateSprint(
                getBaseContext(),
                RequestData.fromExpressRequest(req, data)
            )
        );
    }
}

const controller: SprintController = new SprintController();

export function getSprintController() {
    return controller;
}
