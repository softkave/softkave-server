import makeSingletonFn from "../../utilities/createSingletonFunc";
import RequestData from "../RequestData";
import { wrapEndpointREST } from "../wrapEndpointREST";
import addBlock from "./addBlock/addBlock";
import { getAddBlockContext } from "./addBlock/context";
import addCollaborators from "./addCollaborators/addCollaborators";
import AddCollaboratorsContext from "./addCollaborators/context";
import blockExists from "./blockExists/blockExists";
import deleteBlock from "./deleteBlock/deleteBlock";
import getAverageTimeToCompleteTasks from "./getAverageTimeToCompleteTasks/getAverageTimeToCompleteTasks";
import getBlockChildren from "./getBlockChildren/getBlockChildren";
import getBlockCollaborators from "./getBlockCollaborators/getBlockCollaborators";
import getBlockNotifications from "./getBlockNotifications/getBlockNotifications";
import getBoardTasks from "./getBoardTasks/getBoardTasks";
// import getOrganizationBoards from "./getOrganizationBoards/getOrganizationBoards";
import getUserRootBlocks from "./getUserRootBlocks/getUserRootBlocks";
import removeCollaborator from "./removeCollaborator/removeCollaborator";
import { getRevokeCollaborationRequestContext } from "./revokeCollaborationRequest/context";
import revokeCollaborationRequest from "./revokeCollaborationRequest/revokeCollaborationRequest";
import transferBlock from "./transferBlock/transferBlock";
import UpdateBlockContext from "./updateBlock/context";
import updateBlock from "./updateBlock/updateBlock";

export default class BlockEndpointsGraphQLController {
    // public addBlock = wrapEndpointREST(createTask);
    // public getAverageTimeToCompleteTasks = wrapEndpointREST(createTask);
    // public addCollaborators = wrapEndpointREST(createTask);
    // public blockExists = wrapEndpointREST(createTask);
    // public deleteBlock = wrapEndpointREST(createTask);
    // public getUserRootBlocks = wrapEndpointREST(createTask);
    // public getBoardTasks = wrapEndpointREST(createTask);
    // public getOrganizationBoards = wrapEndpointREST(createTask);
    // public getBlockCollaborators = wrapEndpointREST(createTask);
    // public removeCollaborator = wrapEndpointREST(createTask);
    // public revokeCollaborationRequest = wrapEndpointREST(createTask);
    // public transferBlock = wrapEndpointREST(createTask);
    // public updateBlock = wrapEndpointREST(createTask);
    // public getBlockChildren = wrapEndpointREST(createTask);
    // public getBlockNotifications = wrapEndpointREST(createTask);
}

export const getBlockEndpointsGraphQLController = makeSingletonFn(
    () => new BlockEndpointsGraphQLController()
);
