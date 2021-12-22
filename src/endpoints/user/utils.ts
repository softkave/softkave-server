import { IUser } from "../../mongo/user";
import { getDateString } from "../../utilities/fns";
import { ICollaborator } from "../collaborator/types";
import { extractFields, getFields } from "../utils";
import { IPublicUserData } from "./types";

export function addEntryToPasswordDateLog(arr: string[]) {
    arr.push(getDateString());

    if (arr.length > 5) {
        arr.shift();
    }

    return arr;
}

const publicUserFields = getFields<IPublicUserData>({
    customId: true,
    name: true,
    email: true,
    createdAt: getDateString,
    rootBlockId: true,
    organizations: {
        customId: true,
    },
    color: true,
    notificationsLastCheckedAt: getDateString,
});

export const getPublicUserData = (user: IUser): IPublicUserData => {
    return extractFields(user, publicUserFields);
};



export function getCollaboratorsArray(
  users: Array<ICollaborator>
): ICollaborator[] {
  // @ts-ignore
  return users.map((user) => extractFields(user, collaboratorFields));
}

export const userIsPartOfOrg = (user: IUser, orgId: string) => {
  return user.orgs.findIndex((org) => org.customId === orgId) !== -1;
};
