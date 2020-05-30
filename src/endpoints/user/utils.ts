import { IUser } from "../../mongo/user";
import { IPublicUserData } from "./types";

export function addEntryToPasswordDateLog(arr: string[]) {
  arr.push(new Date().toString());

  if (arr.length > 5) {
    arr.shift();
  }

  return arr;
}

export const getPublicUserData = (user: IUser): IPublicUserData => {
  return {
    color: user.color,
    createdAt: user.createdAt,
    customId: user.customId,
    email: user.email,
    notificationsLastCheckedAt: user.notificationsLastCheckedAt,
    name: user.name,
    orgs: user.orgs,
    rootBlockId: user.rootBlockId,
  };
};

export const userIsPartOfOrg = (user: IUser, orgId: string) => {
  return user.orgs.findIndex((org) => org.customId === orgId) !== -1;
};
