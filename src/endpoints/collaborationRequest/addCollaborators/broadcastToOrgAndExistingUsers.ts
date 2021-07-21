import { ICollaborationRequest } from "../../../mongo/collaboration-request";
import { IUser } from "../../../mongo/user/definitions";
import { IOrganization } from "../../organization/types";
import RequestData from "../../RequestData";
import { IAddCollaboratorsContext } from "./types";

export interface IAddCollaboratorsBroadcastFnData {
    collaborationRequests: ICollaborationRequest[];
    organization: IOrganization;
    indexedExistingUsers: { [key: string]: IUser };
}

export function broadcastToOrganizationsAndExistingUsers(
    context: IAddCollaboratorsContext,
    instData: RequestData,
    data: IAddCollaboratorsBroadcastFnData
) {
    const { collaborationRequests, organization, indexedExistingUsers } = data;

    context.broadcastHelpers.broadcastNewOrganizationCollaborationRequests(
        context,
        instData,
        organization,
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
