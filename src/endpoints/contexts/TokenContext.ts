import * as jwt from 'jsonwebtoken';
import {IToken} from '../../mongo/token/definitions';
import makeSingletonFn from '../../utilities/createSingletonFunc';
import {cast} from '../../utilities/fns';
import {TokenDoesNotExistError} from '../token/errors';
import {JWTTokenScope} from '../types';
import {CredentialsExpiredError} from '../user/errors';
import {wrapFireAndThrowErrorRegular} from '../utils';
import {IBaseContext} from './IBaseContext';

export const CURRENT_USER_TOKEN_VERSION = 5;

export interface IGeneralTokenSubject {
  id: string;
}

export type IUserTokenSubject = IGeneralTokenSubject;

export interface IBaseTokenData<Sub extends IGeneralTokenSubject = IGeneralTokenSubject>
  extends Omit<jwt.JwtPayload, 'sub'> {
  version: number;
  sub: Sub;
}

export type IUserTokenData = IBaseTokenData<IUserTokenSubject>;

export interface ITokenContext {
  saveToken: (ctx: IBaseContext, token: IToken) => Promise<IToken>;
  getTokenById: (ctx: IBaseContext, customId: string) => Promise<IToken | null>;
  getTokenByUserAndClientId: (
    ctx: IBaseContext,
    userId: string,
    clientId: string
  ) => Promise<IToken | null>;
  assertGetTokenById: (ctx: IBaseContext, customId: string) => Promise<IToken>;
  updateTokenById: (
    ctx: IBaseContext,
    customId: string,
    data: Partial<IToken>
  ) => Promise<IToken | null>;
  deleteTokenByUserAndClientId: (
    ctx: IBaseContext,
    clientId: string,
    userId: string
  ) => Promise<void>;
  deleteTokenById: (ctx: IBaseContext, tokenId: string) => Promise<void>;
  deleteTokensByUserId: (ctx: IBaseContext, userId: string) => Promise<void>;
  decodeToken: (ctx: IBaseContext, token: string) => IBaseTokenData<IGeneralTokenSubject>;
  containsAudience: (ctx: IBaseContext, tokenData: IToken, inputAud: JWTTokenScope) => boolean;
  encodeToken: (ctx: IBaseContext, tokenId: string, expires?: number) => string;
}

export default class TokenContext implements ITokenContext {
  saveToken = async (ctx: IBaseContext, data: IToken) => {
    const token = new ctx.models.token.model(data);
    return token.save();
  };

  getTokenById = (ctx: IBaseContext, customId: string) => {
    return ctx.models.token.model
      .findOne({
        customId,
      })
      .lean()
      .exec();
  };

  getTokenByUserAndClientId = (ctx: IBaseContext, userId: string, clientId: string) => {
    return ctx.models.token.model
      .findOne({
        userId,
        clientId,
      })
      .lean()
      .exec();
  };

  assertGetTokenById = async (ctx: IBaseContext, customId: string) => {
    const token = await ctx.token.getTokenById(ctx, customId);

    if (!token) {
      throw new TokenDoesNotExistError();
    }

    return token;
  };

  updateTokenById = (ctx: IBaseContext, customId: string, data: Partial<IToken>) => {
    return ctx.models.token.model
      .findOneAndUpdate(
        {
          customId,
        },
        data,
        {new: true}
      )
      .lean()
      .exec();
  };

  deleteTokenByUserAndClientId = async (ctx: IBaseContext, clientId: string, userId: string) => {
    await ctx.models.token.model
      .deleteOne({
        clientId,
        userId,
      })
      .exec();
  };

  deleteTokenById = async (ctx: IBaseContext, tokenId: string) => {
    await ctx.models.token.model
      .deleteOne({
        customId: tokenId,
      })
      .exec();
  };

  deleteTokensByUserId = async (ctx: IBaseContext, userId: string) => {
    await ctx.models.token.model
      .deleteMany({
        userId,
      })
      .exec();
  };

  decodeToken = wrapFireAndThrowErrorRegular((ctx: IBaseContext, token: string) => {
    const tokenData = cast<IBaseTokenData<IGeneralTokenSubject>>(
      jwt.verify(token, ctx.appVariables.jwtSecret)
    );

    if (tokenData.version < CURRENT_USER_TOKEN_VERSION) {
      throw new CredentialsExpiredError();
    }

    return tokenData;
  });

  containsAudience = (ctx: IBaseContext, tokenData: IToken, inputAud: JWTTokenScope) => {
    const audience = tokenData.audience;
    const hasAudience = !!audience.find(
      nextAud => nextAud === JWTTokenScope.Global || nextAud === inputAud
    );

    return hasAudience;
  };

  encodeToken = (ctx: IBaseContext, tokenId: string, expires?: number) => {
    const payload: Omit<IBaseTokenData, 'iat'> = {
      version: CURRENT_USER_TOKEN_VERSION,
      sub: {id: tokenId},
    };

    if (expires) {
      payload.exp = expires / 1000; // exp is in seconds
    }

    return jwt.sign(payload, ctx.appVariables.jwtSecret);
  };
}

export const getTokenContext = makeSingletonFn(() => new TokenContext());
