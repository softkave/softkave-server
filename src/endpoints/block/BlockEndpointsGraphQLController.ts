import { getBaseContext } from "../contexts/BaseContext";
import RequestData from "../RequestData";
import { wrapEndpoint } from "../utils";
import addBlock from "./addBlock/addBlock";
import AddBlockContext from "./addBlock/context";
import addCollaborators from "./addCollaborators/addCollaborators";
import AddCollaboratorsContext from "./addCollaborators/context";
import blockExists from "./blockExists/blockExists";
import deleteBlock from "./deleteBlock/deleteBlock";
import getBlockChildren from "./getBlockChildren/getBlockChildren";
import getBlockCollaborators from "./getBlockCollaborators/getBlockCollaborators";
import getBlockNotifications from "./getBlockNotifications/getBlockNotifications";
import getUserRootBlocks from "./getUserRootBlocks/getUserRootBlocks";
import removeCollaborator from "./removeCollaborator/removeCollaborator";
import revokeCollaborationRequest from "./revokeCollaborationRequest/revokeCollaborationRequest";
import transferBlock from "./transferBlock/transferBlock";
import UpdateBlockContext from "./updateBlock/context";
import updateBlock from "./updateBlock/updateBlock";

export default class BlockEndpointsGraphQLController {
    public static addBlock(data, req) {
        return wrapEndpoint(data, req, () =>
            addBlock(
                new AddBlockContext(),
                RequestData.fromExpressRequest(req, data)
            )
        );
    }

    public static addCollaborators(data, req) {
        return wrapEndpoint(data, req, () =>
            addCollaborators(
                new AddCollaboratorsContext(),
                RequestData.fromExpressRequest(req, data)
            )
        );
    }

    public static blockExists(data, req) {
        return wrapEndpoint(data, req, () =>
            blockExists(
                getBaseContext(),
                RequestData.fromExpressRequest(req, data)
            )
        );
    }

    public static deleteBlock(data, req) {
        return wrapEndpoint(data, req, () =>
            deleteBlock(
                getBaseContext(),
                RequestData.fromExpressRequest(req, data)
            )
        );
    }

    public static getUserRootBlocks(data, req) {
        return wrapEndpoint(data, req, () =>
            getUserRootBlocks(
                getBaseContext(),
                RequestData.fromExpressRequest(req, data)
            )
        );
    }

    public static getBlockChildren(data, req) {
        return wrapEndpoint(data, req, () =>
            getBlockChildren(
                getBaseContext(),
                RequestData.fromExpressRequest(req, data)
            )
        );
    }

    public static getBlockNotifications(data, req) {
        return wrapEndpoint(data, req, () =>
            getBlockNotifications(
                getBaseContext(),
                RequestData.fromExpressRequest(req, data)
            )
        );
    }

    public static getBlockCollaborators(data, req) {
        return wrapEndpoint(data, req, () =>
            getBlockCollaborators(
                getBaseContext(),
                RequestData.fromExpressRequest(req, data)
            )
        );
    }

    public static removeCollaborator(data, req) {
        return wrapEndpoint(data, req, () =>
            removeCollaborator(
                getBaseContext(),
                RequestData.fromExpressRequest(req, data)
            )
        );
    }

    public static revokeCollaborationRequest(data, req) {
        return wrapEndpoint(data, req, () =>
            revokeCollaborationRequest(
                getBaseContext(),
                RequestData.fromExpressRequest(req, data)
            )
        );
    }

    public static transferBlock(data, req) {
        return wrapEndpoint(data, req, () =>
            transferBlock(
                getBaseContext(),
                RequestData.fromExpressRequest(req, data)
            )
        );
    }

    public static updateBlock(data, req) {
        return wrapEndpoint(data, req, () =>
            updateBlock(
                new UpdateBlockContext(),
                RequestData.fromExpressRequest(req, data)
            )
        );
    }
}
