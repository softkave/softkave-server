import { IBlock } from "../../../mongo/block";
import { IUser } from "../../../mongo/user";
import { indexArray } from "../../../utilities/fns";
import { IOrganization } from "../../org/types";
import { userIsPartOfOrg } from "../../user/utils";
import {
    CollaborationRequestExistsError,
    CollaboratorExistsError,
} from "../errors";
import { isRequestAccepted } from "../utils";
import { IAddCollaboratorsContext, INewCollaboratorInput } from "./types";

export interface IAddCollaboratorsFilterNewCollaboratorsFnData {
    collaborators: INewCollaboratorInput[];
    org: IOrganization;
}

export interface IAddCollaboratorsFilterNewCollaboratorsFnResult {
    indexedExistingUsers: { [key: string]: IUser };
}

export default async function filterNewCollaborators(
    context: IAddCollaboratorsContext,
    data: IAddCollaboratorsFilterNewCollaboratorsFnData
): Promise<IAddCollaboratorsFilterNewCollaboratorsFnResult> {
    const { collaborators, org } = data;
    const newCollaboratorsEmails = collaborators.map((collaborator: any) => {
        return collaborator.email;
    });

    const indexedNewCollaborators = indexArray(collaborators, {
        path: "email",
        reducer: (collaborator, arr, index) => ({
            data: collaborator,
            index,
        }),
    });

    const existingUsers = await context.user.bulkGetUsersByEmail(
        context,
        newCollaboratorsEmails
    );

    const indexedExistingUsers = {};
    const existingUsersInOrg = [];

    existingUsers.forEach((existingUser: IUser) => {
        indexedExistingUsers[existingUser.email] = existingUser;

        if (userIsPartOfOrg(existingUser, org.customId)) {
            existingUsersInOrg.push(existingUser);
        }
    });

    if (existingUsersInOrg.length > 0) {
        const errors = existingUsersInOrg.map(
            (existingUser: Partial<IUser>) => {
                const indexedNewCollaborator =
                    indexedNewCollaborators[existingUser.email];

                return new CollaboratorExistsError({
                    field: `collaborators.${indexedNewCollaborator.index}.email`,
                });
            }
        );

        throw errors;
    }

    const existingCollaborationRequests =
        await context.collaborationRequest.getCollaborationRequestsByRecipientEmail(
            context,
            newCollaboratorsEmails,
            org.customId
        );

    if (existingCollaborationRequests.length > 0) {
        const errors = existingCollaborationRequests.map((request: any) => {
            const indexedNewCollaborator =
                indexedNewCollaborators[request.to.email];
            if (isRequestAccepted(request)) {
                return new CollaboratorExistsError({
                    field: `collaborators.${indexedNewCollaborator.index}.email`,
                });
            } else {
                return new CollaborationRequestExistsError({
                    field: `collaborators.${indexedNewCollaborator.index}.email`,
                });
            }
        });

        throw errors;
    }

    return { indexedExistingUsers };
}
