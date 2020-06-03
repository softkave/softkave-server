import { IUser } from "../../mongo/user";
import { getDate, getDateString } from "../../utilities/fns";
import { IPublicUserData } from "./types";

export function addEntryToPasswordDateLog(arr: Date[]) {
  arr.push(getDate());

  if (arr.length > 5) {
    arr.shift();
  }

  return arr;
}

export const getPublicUserData = (user: IUser): IPublicUserData => {
  return {
    color: user.color,
    createdAt: getDateString(user.createdAt),
    customId: user.customId,
    email: user.email,
    notificationsLastCheckedAt: user.notificationsLastCheckedAt
      ? getDateString(user.notificationsLastCheckedAt)
      : undefined,
    name: user.name,
    orgs: user.orgs,
    rootBlockId: user.rootBlockId,
  };
};

export const userIsPartOfOrg = (user: IUser, orgId: string) => {
  return user.orgs.findIndex((org) => org.customId === orgId) !== -1;
};
