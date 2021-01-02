import { IBlock } from "../../../mongo/block";
import { IUser } from "../../../mongo/user";
import { indexArray } from "../../../utilities/fns";
import { userIsPartOfOrg } from "../../user/utils";
import {
    CollaborationRequestSentBeforeError,
    CollaboratorExistsInOrgError,
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
    const existingUsersInOrg = [];

    existingUsers.forEach((existingUser: IUser) => {
        indexedExistingUsers[existingUser.email] = existingUser;

        if (userIsPartOfOrg(existingUser, block.customId)) {
            existingUsersInOrg.push(existingUser);
        }
    });

    if (existingUsersInOrg.length > 0) {
        const errors = existingUsersInOrg.map(
            (existingUser: Partial<IUser>) => {
                const indexedNewCollaborator =
                    indexedNewCollaborators[existingUser.email];

                return new CollaboratorExistsInOrgError({
                    field: `collaborators.${indexedNewCollaborator.index}.email`,
                });
            }
        );

        throw errors;
    }

    const existingCollaborationRequests = await context.collaborationRequest.getCollaborationRequestsByRecipientEmail(
        context,
        newCollaboratorsEmails,
        block.customId
    );

    if (existingCollaborationRequests.length > 0) {
        const errors = existingCollaborationRequests.map((request: any) => {
            const indexedNewCollaborator =
                indexedNewCollaborators[request.to.email];
            if (isRequestAccepted(request)) {
                return new CollaboratorExistsInOrgError({
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
