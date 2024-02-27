import {isBoolean, isString} from 'lodash';
import {SystemResourceType} from '../../models/system';
import {IClient} from '../../mongo/client/definitions';
import {IToken} from '../../mongo/token/definitions';
import {IUser} from '../../mongo/user/definitions';
import makeSingletonFn from '../../utilities/createSingletonFunc';
import {assertArg} from '../../utilities/fns';
import {tryGetResourceTypeFromId} from '../../utilities/ids';
import RequestData from '../RequestData';
import {PermissionDeniedError} from '../errors';
import {NoSocketConnectionError} from '../socket/errors';
import {JWTTokenScope} from '../types';
import {
  CredentialsNotFoundError,
  InvalidCredentialsError,
  LoginAgainError,
  UserDoesNotExistError,
} from '../user/errors';
import {IBaseContext} from './IBaseContext';
import {IAppSocket} from './types';

export interface ISessionContext {
  /**
   * @param {boolean} [allowAnonymousUsers=false] - Allow anonymous users.
   * Defaults to `false`. Throws `PermissionDeniedError` if is `false` and request
   * is from an anonymous user.
   */
  getTokenData(
    ctx: IBaseContext,
    data: RequestData,
    allowAnonymousUsers?: boolean
  ): Promise<IToken>;
  getTokenData(
    ctx: IBaseContext,
    data: RequestData,
    audience?: JWTTokenScope,
    allowAnonymousUsers?: boolean
  ): Promise<IToken>;

  getClient: (ctx: IBaseContext, data: RequestData) => Promise<IClient>;

  /**
   * @param {boolean} [allowAnonymousUsers=false] - Allow anonymous users.
   * Defaults to `false`. Throws `PermissionDeniedError` if is `false` and request
   * is from an anonymous user.
   */
  getUser(ctx: IBaseContext, data: RequestData, allowAnonymousUsers?: boolean): Promise<IUser>;
  getUser(
    ctx: IBaseContext,
    data: RequestData,
    audience?: JWTTokenScope,
    allowAnonymousUsers?: boolean
  ): Promise<IUser>;

  /**
   * @param {boolean} [allowAnonymousUsers=false] - Allow anonymous users.
   * Defaults to `false`. Throws `PermissionDeniedError` if is `false` and request
   * is from an anonymous user.
   */
  tryGetUser(
    ctx: IBaseContext,
    data: RequestData,
    allowAnonymousUsers?: boolean
  ): Promise<IUser | null>;
  tryGetUser(
    ctx: IBaseContext,
    data: RequestData,
    audience?: JWTTokenScope,
    allowAnonymousUsers?: boolean
  ): Promise<IUser | null>;

  /**
   * @param {boolean} [allowAnonymousUsers=false] - Allow anonymous users.
   * Defaults to `false`. Throws `PermissionDeniedError` if is `false` and request
   * is from an anonymous user.
   */
  tryGetTokenData(
    ctx: IBaseContext,
    data: RequestData,
    allowAnonymousUsers?: boolean
  ): Promise<IToken | null>;
  tryGetTokenData(
    ctx: IBaseContext,
    data: RequestData,
    audience?: JWTTokenScope,
    allowAnonymousUsers?: boolean
  ): Promise<IToken | null>;
  tryGetClient: (ctx: IBaseContext, data: RequestData) => Promise<IClient | null>;
  assertSocket: (data: RequestData) => void;
  assertGetSocket: (data: RequestData) => IAppSocket;
  isTokenForAnonymousUser: (token: IToken) => boolean;
}

// TODO: Only reuse cached token and user if JWTTokenScope is the same
// TODO: Default to Login JWTTokenScope when none is provided

export default class SessionContext implements ISessionContext {
  tryGetTokenData = async (...args: any[]) => {
    const ctx = args[0] as IBaseContext;
    const data = args[1] as RequestData;
    const audience = (isString(args[2]) ? args[2] : JWTTokenScope.Login) as JWTTokenScope;
    const allowAnonymousUsers = isBoolean(args[2]) ? args[2] : isBoolean(args[3]) ? args[3] : false;
    if (data.tokenData) {
      return data.tokenData;
    }

    const incomingTokenData = data.incomingTokenData;
    if (!incomingTokenData) {
      return null;
    }

    const tokenData = await ctx.token.getTokenById(ctx, incomingTokenData.sub.id);
    if (!tokenData) {
      return null;
    }
    if (audience) {
      ctx.token.containsAudience(ctx, tokenData, audience);
    }
    if (ctx.session.isTokenForAnonymousUser(tokenData) && !allowAnonymousUsers) {
      throw new PermissionDeniedError();
    }

    data.tokenData = tokenData;
    return tokenData;
  };

  async getTokenData(...args: any[]) {
    const ctx = args[0] as IBaseContext;
    const data = args[1] as RequestData;
    const audience = (isString(args[2]) ? args[2] : JWTTokenScope.Login) as JWTTokenScope;
    const allowAnonymousUsers = isBoolean(args[2]) ? args[2] : isBoolean(args[3]) ? args[3] : false;
    const tokenData = await ctx.session.tryGetTokenData(ctx, data, audience, allowAnonymousUsers);
    if (!tokenData) {
      throw new CredentialsNotFoundError();
    }
    return tokenData;
  }

  tryGetClient = async (ctx: IBaseContext, data: RequestData) => {
    if (data.client) {
      return data.client;
    }

    const clientId = data.clientId;
    if (!clientId) {
      return null;
    }

    const tokenData = await ctx.session.tryGetTokenData(ctx, data);
    checkTokenClientID(tokenData, clientId);
    const client = await ctx.client.getClientById(ctx, clientId);
    if (!client) {
      return null;
    }

    data.client = client;
    return client;
  };

  getClient = async (ctx: IBaseContext, data: RequestData) => {
    if (data.client) {
      return data.client;
    }

    const tokenData = await ctx.session.tryGetTokenData(ctx, data);
    const clientId = data.clientId;
    if (!clientId) {
      throw new LoginAgainError();
    }

    checkTokenClientID(tokenData, clientId);
    const client = await ctx.client.assertGetClientById(ctx, clientId);
    data.client = client;
    return client;
  };

  tryGetUser = async (...args: any[]) => {
    const ctx = args[0] as IBaseContext;
    const data = args[1] as RequestData;
    const audience = (isString(args[2]) ? args[2] : JWTTokenScope.Login) as JWTTokenScope;
    const allowAnonymousUsers = isBoolean(args[2]) ? args[2] : isBoolean(args[3]) ? args[3] : false;
    if (data.user) {
      return data.user;
    }

    const tokenData = await ctx.session.tryGetTokenData(ctx, data, audience, allowAnonymousUsers);
    if (!tokenData) {
      return null;
    }

    const user = ctx.session.isTokenForAnonymousUser(tokenData)
      ? await ctx.data.anonymousUser.getOneByQuery(ctx, {customId: tokenData.userId})
      : await ctx.user.getUserById(ctx, tokenData.userId);

    if (!user) {
      return null;
    }

    data.user = user;
    return user;
  };

  getUser = async (...args: any[]) => {
    const ctx = args[0] as IBaseContext;
    const data = args[1] as RequestData;
    const audience = (isString(args[2]) ? args[2] : JWTTokenScope.Login) as JWTTokenScope;
    const allowAnonymousUsers = isBoolean(args[2]) ? args[2] : isBoolean(args[3]) ? args[3] : false;
    if (data.user) {
      return data.user;
    }

    const tokenData = await ctx.session.getTokenData(ctx, data, audience, allowAnonymousUsers);
    const user = ctx.session.isTokenForAnonymousUser(tokenData)
      ? await ctx.data.anonymousUser.getOneByQuery(ctx, {customId: tokenData.userId})
      : await ctx.user.getUserById(ctx, tokenData.userId);
    assertArg(user, new UserDoesNotExistError());
    data.user = user;
    return user;
  };

  assertSocket = async (data: RequestData) => {
    if (!data.socket) {
      throw new NoSocketConnectionError();
    }
  };

  assertGetSocket = (data: RequestData) => {
    this.assertSocket(data);
    return data.socket!;
  };

  isTokenForAnonymousUser = (token: IToken) => {
    return tryGetResourceTypeFromId(token.userId) === SystemResourceType.AnonymousUser;
  };
}

export const getSessionContext = makeSingletonFn(() => new SessionContext());

function checkTokenClientID(token: IToken | null, clientId: string) {
  if (token?.clientId && token.clientId !== clientId) {
    throw new InvalidCredentialsError();
  }
}
