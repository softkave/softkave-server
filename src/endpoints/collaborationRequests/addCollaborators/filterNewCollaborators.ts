import { IUser } from "../../../mongo/user";
import { indexArray } from "../../../utilities/fns";
import { IOrganization } from "../../organizations/types";
import { userIsPartOfOrganization } from "../../user/utils";
import {
  CollaborationRequestExistsError,
  CollaboratorExistsError,
} from "../errors";
import { isRequestAccepted } from "../utils";
import { IAddCollaboratorsContext, INewCollaboratorInput } from "./types";

export interface IAddCollaboratorsFilterNewCollaboratorsFnData {
  collaborators: INewCollaboratorInput[];
  organization: IOrganization;
}

export interface IAddCollaboratorsFilterNewCollaboratorsFnResult {
  indexedExistingUsers: { [key: string]: IUser };
}

export default async function filterNewCollaborators(
  context: IAddCollaboratorsContext,
  data: IAddCollaboratorsFilterNewCollaboratorsFnData
): Promise<IAddCollaboratorsFilterNewCollaboratorsFnResult> {
  const { collaborators, organization } = data;
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
    indexedExistingUsers[existingUser.email.toLowerCase()] = existingUser;

    if (userIsPartOfOrganization(existingUser, organization.customId)) {
      existingUsersInOrganization.push(existingUser);
    }
  });

  if (existingUsersInOrganization.length > 0) {
    const errors = existingUsersInOrganization.map(
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
      organization.customId
    );

  if (existingCollaborationRequests.length > 0) {
    const errors = existingCollaborationRequests.map((request: any) => {
      const indexedNewCollaborator = indexedNewCollaborators[request.to.email];
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
