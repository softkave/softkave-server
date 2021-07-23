import { IUser } from "../../mongo/user";
import { getDateString } from "../../utilities/fns";
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

export const userIsPartOfOrganization = (
    user: IUser,
    organizationId: string
) => {
    return (
        user.organizations.findIndex(
            (organization) => organization.customId === organizationId
        ) !== -1
    );
};
