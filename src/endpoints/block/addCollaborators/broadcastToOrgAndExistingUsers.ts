import { IBlock } from "../../../mongo/block";
import { ICollaborationRequest } from "../../../mongo/collaboration-request";
import { IUser } from "../../../mongo/user/definitions";
import RequestData from "../../RequestData";
import { IAddCollaboratorsContext } from "./types";

export interface IAddCollaboratorsBroadcastFnData {
    collaborationRequests: ICollaborationRequest[];
    block: IBlock;
    indexedExistingUsers: { [key: string]: IUser };
}

export function broadcastToOrganizationsAndExistingUsers(
    context: IAddCollaboratorsContext,
    instData: RequestData,
    data: IAddCollaboratorsBroadcastFnData
) {
    const { collaborationRequests, block, indexedExistingUsers } = data;

    context.broadcastHelpers.broadcastNewOrganizationCollaborationRequests(
        context,
        instData,
        block,
        collaborationRequests
    );

    collaborationRequests.forEach((request) => {
        const existingUser = indexedExistingUsers[request.to.email];

        if (!existingUser) {
            return;
        }

        context.broadcastHelpers.broadcastNewUserCollaborationRequest(
            context,
            instData,
            existingUser,
            request
        );
    });
}
