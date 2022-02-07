import { IBlock } from "../../../mongo/block";
import { IUser } from "../../../mongo/user";
import { indexArray } from "../../../utilities/fns";
import { userIsPartOfOrganization } from "../../user/utils";
import {
    CollaborationRequestSentBeforeError,
    CollaboratorExistsInOrganizationError,
} from "../errors";
import { isRequestAccepted } from "../utils";
import { IAddCollaboratorsContext, INewCollaboratorInput } from "./types";

export interface IAddCollaboratorsFilterNewCollaboratorsFnData {
    collaborators: INewCollaboratorInput[];
    block: IBlock;
}

export interface IAddCollaboratorsFilterNewCollaboratorsFnResult {
    indexedExistingUsers: { [key: string]: IUser };
}

export default async function filterNewCollaborators(
    context: IAddCollaboratorsContext,
    data: IAddCollaboratorsFilterNewCollaboratorsFnData
): Promise<IAddCollaboratorsFilterNewCollaboratorsFnResult> {
    const { collaborators, block } = data;

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
    const existingUsersInOrganization = [];

    existingUsers.forEach((existingUser: IUser) => {
        indexedExistingUsers[existingUser.email] = existingUser;

        if (userIsPartOfOrganization(existingUser, block.customId)) {
            existingUsersInOrganization.push(existingUser);
        }
    });

    if (existingUsersInOrganization.length > 0) {
        const errors = existingUsersInOrganization.map(
            (existingUser: Partial<IUser>) => {
                const indexedNewCollaborator =
                    indexedNewCollaborators[existingUser.email];

                return new CollaboratorExistsInOrganizationError({
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
            block.customId
        );

    if (existingCollaborationRequests.length > 0) {
        const errors = existingCollaborationRequests.map((request: any) => {
            const indexedNewCollaborator =
                indexedNewCollaborators[request.to.email];
            if (isRequestAccepted(request)) {
                return new CollaboratorExistsInOrganizationError({
                    field: `collaborators.${indexedNewCollaborator.index}.email`,
                });
            } else {
                return new CollaborationRequestSentBeforeError({
                    field: `collaborators.${indexedNewCollaborator.index}.email`,
                });
            }
        });

        throw errors;
    }

    return { indexedExistingUsers };
}
