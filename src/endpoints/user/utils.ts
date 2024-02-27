import {SystemResourceType} from '../../models/system';
import {IUser} from '../../mongo/user/definitions';
import {getDateString, getDateStringIfExists} from '../../utilities/fns';
import {tryGetResourceTypeFromId} from '../../utilities/ids';
import {IBaseContext} from '../contexts/IBaseContext';
import {extractFields, getFields, publicResourceFields} from '../utils';
import {UserDoesNotExistError} from './errors';
import {IPublicUserData} from './types';

export function addEntryToPasswordDateLog(arr: string[] = []) {
  arr.push(getDateString());
  if (arr.length > 5) {
    arr.shift();
  }

  return arr;
}

const publicUserFields = getFields<IPublicUserData>({
  ...publicResourceFields,
  firstName: true,
  lastName: true,
  email: true,
  createdAt: getDateString,
  workspaces: {
    customId: true,
  },
  color: true,
  isAnonymousUser: true,
  notificationsLastCheckedAt: getDateStringIfExists,
});

export const getPublicUserData = (user: IUser): IPublicUserData => {
  return extractFields(user, publicUserFields);
};

export const userIsPartOfOrganization = (user: IUser, orgId: string) => {
  return user.workspaces.findIndex(org => org.customId === orgId) !== -1;
};

export function assertUser(u?: IUser | null): asserts u {
  if (!u) {
    throw new UserDoesNotExistError();
  }
}

export async function assertUpdateUser(ctx: IBaseContext, id: string, update: Partial<IUser>) {
  const user = await ctx.user.updateUserById(ctx, id, update);
  assertUser(user);
  return user;
}

export async function getUser(ctx: IBaseContext, userId: string) {
  if (tryGetResourceTypeFromId(userId) === SystemResourceType.AnonymousUser) {
    return await ctx.data.anonymousUser.getOneByQuery(ctx, {customId: userId});
  } else {
    return await ctx.user.getUserById(ctx, userId);
  }
}
