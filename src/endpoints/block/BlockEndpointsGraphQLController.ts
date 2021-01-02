import makeSingletonFunc from "../../utilities/createSingletonFunc";
import { getBaseContext } from "../contexts/BaseContext";
import RequestData from "../RequestData";
import { wrapEndpoint } from "../utils";
import addBlock from "./addBlock/addBlock";
import { getAddBlockContext } from "./addBlock/context";
import addCollaborators from "./addCollaborators/addCollaborators";
import AddCollaboratorsContext from "./addCollaborators/context";
import blockExists from "./blockExists/blockExists";
import deleteBlock from "./deleteBlock/deleteBlock";
import getBlockChildren from "./getBlockChildren/getBlockChildren";
import getBlockCollaborators from "./getBlockCollaborators/getBlockCollaborators";
import getBlockNotifications from "./getBlockNotifications/getBlockNotifications";
import getBoardTasks from "./getBoardTasks/getBoardTasks";
import getOrgBoards from "./getOrgBoards/getOrgBoards";
import getUserRootBlocks from "./getUserRootBlocks/getUserRootBlocks";
import removeCollaborator from "./removeCollaborator/removeCollaborator";
import { getRevokeCollaborationRequestContext } from "./revokeCollaborationRequest/context";
import revokeCollaborationRequest from "./revokeCollaborationRequest/revokeCollaborationRequest";
import transferBlock from "./transferBlock/transferBlock";
import UpdateBlockContext from "./updateBlock/context";
import updateBlock from "./updateBlock/updateBlock";

export default class BlockEndpointsGraphQLController {
    public addBlock(data, req) {
        return wrapEndpoint(data, req, () =>
            addBlock(
                getAddBlockContext(),
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
                getRevokeCollaborationRequestContext(),
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

    public getBlockChildren(data, req) {
        return wrapEndpoint(data, req, () =>
            getBlockChildren(
                getBaseContext(),
                RequestData.fromExpressRequest(req, data)
            )
        );
    }

    public getBlockNotifications(data, req) {
        return wrapEndpoint(data, req, () =>
            getBlockNotifications(
                getBaseContext(),
                RequestData.fromExpressRequest(req, data)
            )
        );
    }
}

export const getBlockEndpointsGraphQLController = makeSingletonFunc(
    () => new BlockEndpointsGraphQLController()
);
