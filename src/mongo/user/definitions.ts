import {Connection} from 'mongoose';
import {IResource} from '../../models/resource';
import makeSingletonFn from '../../utilities/createSingletonFunc';
import MongoModel from '../MongoModel';
import {getDefaultMongoConnection} from '../defaultConnection';
import {resourceSchema} from '../definitions';
import {ensureMongoSchemaFields} from '../utils';

export interface IUserOrganization {
  customId: string;
}

export interface IUser extends IResource {
  lastName: string;
  firstName: string;
  email: string;
  hash: string;
  forgotPasswordHistory?: Array<string>;
  passwordLastChangedAt?: string | Date;
  workspaces: Array<IUserOrganization>;
  color: string;
  notificationsLastCheckedAt?: string;
  isAnonymousUser?: boolean;
}

export const userOrganizationMongoSchema = ensureMongoSchemaFields<IUserOrganization>({
  customId: {type: String, index: true},
});
export const userMongoSchema = ensureMongoSchemaFields<IUser>({
  ...resourceSchema,
  lastName: {type: String},
  firstName: {type: String},
  email: {type: String, unique: true, index: true},
  hash: {type: String},
  forgotPasswordHistory: {type: [Date]},
  passwordLastChangedAt: {type: Date},
  workspaces: {type: [userOrganizationMongoSchema]},
  color: {type: String},
  notificationsLastCheckedAt: {type: Date},
  isAnonymousUser: {type: Boolean},
});

const anonymousUserModelName = 'anonymous_user_01';
const anonymousUsercollectionName = 'anonymous_users_01';

export const getAnonymousUserMongoDbModel = makeSingletonFn(
  (conn: Connection = getDefaultMongoConnection().getConnection()) => {
    return new MongoModel<IUser>({
      modelName: anonymousUserModelName,
      collectionName: anonymousUsercollectionName,
      rawSchema: userMongoSchema,
      connection: conn,
    });
  }
);

export type IAnonymousUserMongoDbModel = MongoModel<IUser>;

const userModelName = 'user_01';
const userCollectionName = 'users_01';

export const getUserModel = makeSingletonFn(
  (conn: Connection = getDefaultMongoConnection().getConnection()) => {
    return new MongoModel<IUser>({
      modelName: userModelName,
      collectionName: userCollectionName,
      rawSchema: userMongoSchema,
      connection: conn,
    });
  }
);

export type IUserModel = MongoModel<IUser>;
