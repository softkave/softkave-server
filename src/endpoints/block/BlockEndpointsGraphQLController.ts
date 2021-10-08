import makeSingletonFn from "../../utilities/createSingletonFunc";
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
import getOrganizationBoards from "./getOrganizationBoards/getOrganizationBoards";
import getUserRootBlocks from "./getUserRootBlocks/getUserRootBlocks";
import removeCollaborator from "./removeCollaborator/removeCollaborator";
import { getRevokeCollaborationRequestContext } from "./revokeCollaborationRequest/context";
import revokeCollaborationRequest from "./revokeCollaborationRequest/revokeCollaborationRequest";
import transferBlock from "./transferBlock/transferBlock";
import UpdateBlockContext from "./updateBlock/context";
import updateBlock from "./updateBlock/updateBlock";

export default class BlockEndpointsGraphQLController {
    public addBlock(data, req) {
        return wrapEndpoint(data, req, async () =>
            addBlock(
                getAddBlockContext(),
                await RequestData.fromExpressRequest(
                    getBaseContext(),
                    req,
                    data
                )
            )
        );
    }

    public addCollaborators(data, req) {
        return wrapEndpoint(data, req, async () =>
            addCollaborators(
                new AddCollaboratorsContext(),
                await RequestData.fromExpressRequest(
                    getBaseContext(),
                    req,
                    data
                )
            )
        );
    }

    public blockExists(data, req) {
        return wrapEndpoint(data, req, async () =>
            blockExists(
                getBaseContext(),
                await RequestData.fromExpressRequest(
                    getBaseContext(),
                    req,
                    data
                )
            )
        );
    }

    public deleteBlock(data, req) {
        return wrapEndpoint(data, req, async () =>
            deleteBlock(
                getBaseContext(),
                await RequestData.fromExpressRequest(
                    getBaseContext(),
                    req,
                    data
                )
            )
        );
    }

    public getUserRootBlocks(data, req) {
        return wrapEndpoint(data, req, async () =>
            getUserRootBlocks(
                getBaseContext(),
                await RequestData.fromExpressRequest(
                    getBaseContext(),
                    req,
                    data
                )
            )
        );
    }

    public getBoardTasks(data, req) {
        return wrapEndpoint(data, req, async () =>
            getBoardTasks(
                getBaseContext(),
                await RequestData.fromExpressRequest(
                    getBaseContext(),
                    req,
                    data
                )
            )
        );
    }

    public getOrganizationBoards(data, req) {
        return wrapEndpoint(data, req, async () =>
            getOrganizationBoards(
                getBaseContext(),
                await RequestData.fromExpressRequest(
                    getBaseContext(),
                    req,
                    data
                )
            )
        );
    }

    public getBlockCollaborators(data, req) {
        return wrapEndpoint(data, req, async () =>
            getBlockCollaborators(
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

    public revokeCollaborationRequest(data, req) {
        return wrapEndpoint(data, req, async () =>
            revokeCollaborationRequest(
                getRevokeCollaborationRequestContext(),
                await RequestData.fromExpressRequest(
                    getBaseContext(),
                    req,
                    data
                )
            )
        );
    }

    public transferBlock(data, req) {
        return wrapEndpoint(data, req, async () =>
            transferBlock(
                getBaseContext(),
                await RequestData.fromExpressRequest(
                    getBaseContext(),
                    req,
                    data
                )
            )
        );
    }

    public updateBlock(data, req) {
        return wrapEndpoint(data, req, async () =>
            updateBlock(
                new UpdateBlockContext(),
                await RequestData.fromExpressRequest(
                    getBaseContext(),
                    req,
                    data
                )
            )
        );
    }

    public getBlockChildren(data, req) {
        return wrapEndpoint(data, req, async () =>
            getBlockChildren(
                getBaseContext(),
                await RequestData.fromExpressRequest(
                    getBaseContext(),
                    req,
                    data
                )
            )
        );
    }

    public getBlockNotifications(data, req) {
        return wrapEndpoint(data, req, async () =>
            getBlockNotifications(
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

export const getBlockEndpointsGraphQLController = makeSingletonFn(
    () => new BlockEndpointsGraphQLController()
);
