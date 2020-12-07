import makeSingletonFunc from "../../utilities/createSingletonFunc";
import { getBaseContext } from "../contexts/BaseContext";
import RequestData from "../RequestData";
import { wrapEndpoint } from "../utils";
import addBlock from "./addBlock/addBlock";
import AddBlockContext from "./addBlock/context";
import addCollaborators from "./addCollaborators/addCollaborators";
import AddCollaboratorsContext from "./addCollaborators/context";
import blockExists from "./blockExists/blockExists";
import deleteBlock from "./deleteBlock/deleteBlock";
import getBlockCollaborators from "./getBlockCollaborators/getBlockCollaborators";
import getBoardTasks from "./getBoardTasks/getBoardTasks";
import getOrgBoards from "./getOrgBoards/getOrgBoards";
import getUserRootBlocks from "./getUserRootBlocks/getUserRootBlocks";
import removeCollaborator from "./removeCollaborator/removeCollaborator";
import revokeCollaborationRequest from "./revokeCollaborationRequest/revokeCollaborationRequest";
import transferBlock from "./transferBlock/transferBlock";
import UpdateBlockContext from "./updateBlock/context";
import updateBlock from "./updateBlock/updateBlock";

export default class BlockEndpointsGraphQLController {
    public addBlock(data, req) {
        return wrapEndpoint(data, req, () =>
            addBlock(
                new AddBlockContext(),
                RequestData.fromExpressRequest(req, data)
            )
        );
    }

    public addCollaborators(data, req) {
        return wrapEndpoint(data, req, () =>
            addCollaborators(
                new AddCollaboratorsContext(),
                RequestData.fromExpressRequest(req, data)
            )
        );
    }

    public blockExists(data, req) {
        return wrapEndpoint(data, req, () =>
            blockExists(
                getBaseContext(),
                RequestData.fromExpressRequest(req, data)
            )
        );
    }

    public deleteBlock(data, req) {
        return wrapEndpoint(data, req, () =>
            deleteBlock(
                getBaseContext(),
                RequestData.fromExpressRequest(req, data)
            )
        );
    }

    public getUserRootBlocks(data, req) {
        return wrapEndpoint(data, req, () =>
            getUserRootBlocks(
                getBaseContext(),
                RequestData.fromExpressRequest(req, data)
            )
        );
    }

    public getBoardTasks(data, req) {
        return wrapEndpoint(data, req, () =>
            getBoardTasks(
                getBaseContext(),
                RequestData.fromExpressRequest(req, data)
            )
        );
    }

    public getOrgBoards(data, req) {
        return wrapEndpoint(data, req, () =>
            getOrgBoards(
                getBaseContext(),
                RequestData.fromExpressRequest(req, data)
            )
        );
    }

    public getBlockCollaborators(data, req) {
        return wrapEndpoint(data, req, () =>
            getBlockCollaborators(
                getBaseContext(),
                RequestData.fromExpressRequest(req, data)
            )
        );
    }

    public removeCollaborator(data, req) {
        return wrapEndpoint(data, req, () =>
            removeCollaborator(
                getBaseContext(),
                RequestData.fromExpressRequest(req, data)
            )
        );
    }

    public revokeCollaborationRequest(data, req) {
        return wrapEndpoint(data, req, () =>
            revokeCollaborationRequest(
                getBaseContext(),
                RequestData.fromExpressRequest(req, data)
            )
        );
    }

    public transferBlock(data, req) {
        return wrapEndpoint(data, req, () =>
            transferBlock(
                getBaseContext(),
                RequestData.fromExpressRequest(req, data)
            )
        );
    }

    public updateBlock(data, req) {
        return wrapEndpoint(data, req, () =>
            updateBlock(
                new UpdateBlockContext(),
                RequestData.fromExpressRequest(req, data)
            )
        );
    }
}

export const getBlockEndpointsGraphQLController = makeSingletonFunc(
    () => new BlockEndpointsGraphQLController()
);
