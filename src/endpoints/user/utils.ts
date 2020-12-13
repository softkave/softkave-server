import { IUser } from "../../mongo/user";
import { getDate, getDateString } from "../../utilities/fns";
import { extractFields, getFields } from "../utils";
import { ICollaborator, IPublicUserData } from "./types";

export function addEntryToPasswordDateLog(arr: Date[]) {
    arr.push(getDate());

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
    orgs: {
        customId: true,
        permissionGroups: true,
    },
    color: true,
    notificationsLastCheckedAt: getDateString,
});

const collaboratorFields = getFields<ICollaborator>({
    customId: true,
    name: true,
    email: true,
    color: true,
});

export const getPublicUserData = (user: IUser): IPublicUserData => {
    return extractFields(user, publicUserFields);
};

export function getCollaboratorDataFromUser(user: IUser): ICollaborator {
    return extractFields(user, collaboratorFields);
}

export function getCollaboratorsArray(
    users: Array<ICollaborator | IUser>
): ICollaborator[] {
    return users.map((user) => extractFields(user, collaboratorFields));
}

export const userIsPartOfOrg = (user: IUser, orgId: string) => {
    return user.orgs.findIndex((org) => org.customId === orgId) !== -1;
};
