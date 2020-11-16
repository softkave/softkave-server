import { IBlock } from "../../../mongo/block";
import { INotification } from "../../../mongo/notification/definitions";
import { IUser } from "../../../mongo/user/definitions";
import RequestData from "../../RequestData";
import { IAddCollaboratorsContext } from "./types";

export interface IAddCollaboratorsBroadcastFnData {
    collaborationRequests: INotification[];
    block: IBlock;
    indexedExistingUsers: { [key: string]: IUser };
}

export function broadcastToOrgsAndExistingUsers(
    context: IAddCollaboratorsContext,
    instData: RequestData,
    data: IAddCollaboratorsBroadcastFnData
) {
    const { collaborationRequests, block, indexedExistingUsers } = data;

    context.broadcastHelpers.broadcastNewOrgCollaborationRequests(
        context,
        block,
        collaborationRequests,
        instData
    );

    collaborationRequests.forEach((request) => {
        const existingUser = indexedExistingUsers[request.to.email];

        if (!existingUser) {
            return;
        }

        context.broadcastHelpers.broadcastNewUserCollaborationRequest(
            context,
            existingUser,
            request,
            instData
        );
    });
}
