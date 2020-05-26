import { IUser } from "../../mongo/user";
import { IPublicUserData } from "./types";

export function addEntryToPasswordDateLog(arr: number[]) {
  arr.push(Date.now());

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
    lastNotificationCheckTime: user.lastNotificationCheckTime,
    name: user.name,
    orgs: user.orgs,
  };
};
