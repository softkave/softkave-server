import {SystemResourceType} from '../../models/system';
import {IUser} from '../../mongo/user/definitions';
import makeSingletonFn from '../../utilities/createSingletonFunc';
import {getNewId02} from '../../utilities/ids';
import {IUpdateItemById} from '../../utilities/types';
import {UserDoesNotExistError} from '../user/errors';
import {saveNewItemToDb} from '../utils';
import {IBaseContext} from './IBaseContext';

export interface IUserContext {
  getUserByEmail: (ctx: IBaseContext, email: string) => Promise<IUser | null>;
  bulkGetUsersByEmail: (ctx: IBaseContext, email: string[]) => Promise<IUser[]>;
  getUserById: (ctx: IBaseContext, customId: string) => Promise<IUser | null>;
  assertGetUserById: (ctx: IBaseContext, customId: string) => Promise<IUser>;
  updateUserById: (
    ctx: IBaseContext,
    customId: string,
    data: Partial<IUser>
  ) => Promise<IUser | null>;
  bulkGetUsersById: (ctx: IBaseContext, ids: string[]) => Promise<IUser[]>;
  saveUser: (ctx: IBaseContext, user: Omit<IUser, 'customId'>) => Promise<IUser>;
  saveUser02: (ctx: IBaseContext, user: IUser) => Promise<IUser>;
  userExists: (ctx: IBaseContext, email: string) => Promise<boolean>;
  getBlockCollaborators: (ctx: IBaseContext, blockId: string) => Promise<IUser[]>;
  getOrganizationUsers: (ctx: IBaseContext, blockId: string) => Promise<IUser[]>;
  bulkUpdateUsersById: (ctx: IBaseContext, users: Array<IUpdateItemById<IUser>>) => Promise<void>;
}

export default class UserContext implements IUserContext {
  getUserByEmail = (ctx: IBaseContext, email: string) => {
    return ctx.models.user.model
      .findOne({email: new RegExp(`^${email}$`, 'i')})
      .lean()
      .exec();
  };

  getUserById = (ctx: IBaseContext, customId: string) => {
    return ctx.models.user.model
      .findOne({
        customId,
      })
      .lean()
      .exec();
  };

  assertGetUserById = async (ctx: IBaseContext, customId: string) => {
    const user = await ctx.user.getUserById(ctx, customId);
    if (!user) {
      throw new UserDoesNotExistError();
    }

    return user;
  };

  updateUserById = (ctx: IBaseContext, customId: string, data: Partial<IUser>) => {
    return ctx.models.user.model.findOneAndUpdate({customId}, data, {new: true}).lean().exec();
  };

  bulkGetUsersById = (ctx: IBaseContext, ids: string[]) => {
    return ctx.models.user.model.find({customId: {$in: ids}}).exec();
  };

  userExists = async (ctx: IBaseContext, email: string) => {
    const exists = await ctx.models.user.model.exists({email: new RegExp(`^${email}$`, 'i')});
    return !!exists;
  };

  bulkGetUsersByEmail = (ctx: IBaseContext, emails: string[]) => {
    return ctx.models.user.model
      .find({email: {$in: emails}}, 'email workspaces customId')
      .lean()
      .exec();
  };

  getBlockCollaborators = (ctx: IBaseContext, blockId: string) => {
    return ctx.models.user.model
      .find(
        {workspaces: {$elemMatch: {customId: blockId}}},
        {
          organizations: {$elemMatch: {customId: blockId}},
          firstName: 1,
          lastName: 1,
          email: 1,
          createdAt: 1,
          customId: 1,
          color: 1,
        }
      )
      .lean()
      .exec();
  };

  getOrganizationUsers = (ctx: IBaseContext, blockId: string) => {
    return ctx.models.user.model
      .find({
        workspaces: {$elemMatch: {customId: blockId}},
      })
      .lean()
      .exec();
  };

  bulkUpdateUsersById = async (ctx: IBaseContext, users: Array<IUpdateItemById<IUser>>) => {
    const opts = users.map(item => ({
      updateOne: {filter: {customId: item.id}, update: item.data},
    }));

    await ctx.models.user.model.bulkWrite(opts);
  };

  async saveUser(ctx: IBaseContext, user: Omit<IUser, 'customId'>) {
    const userDoc = new ctx.models.user.model(user);
    return saveNewItemToDb(async () => {
      userDoc.customId = getNewId02(SystemResourceType.User);
      await userDoc.save();
      return userDoc;
    });
  }

  async saveUser02(ctx: IBaseContext, user: IUser) {
    const doc = new ctx.models.user.model(user);
    await doc.save();
    return doc;
  }
}

export const getUserContext = makeSingletonFn(() => new UserContext());
