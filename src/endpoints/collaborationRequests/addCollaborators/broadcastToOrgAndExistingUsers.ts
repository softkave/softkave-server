import { ICollaborationRequest } from "../../../mongo/collaboration-request";
import { IUser } from "../../../mongo/user/definitions";
import { IOrganization } from "../../org/types";
import RequestData from "../../RequestData";
import { IAddCollaboratorsContext } from "./types";

export interface IAddCollaboratorsBroadcastFnData {
    collaborationRequests: ICollaborationRequest[];
    org: IOrganization;
    indexedExistingUsers: { [key: string]: IUser };
}

export function broadcastToOrgsAndExistingUsers(
    context: IAddCollaboratorsContext,
    instData: RequestData,
    data: IAddCollaboratorsBroadcastFnData
) {
    const { collaborationRequests, org, indexedExistingUsers } = data;

    context.broadcastHelpers.broadcastNewOrgCollaborationRequests(
        context,
        instData,
        org,
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
