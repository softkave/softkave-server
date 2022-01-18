import { IToken } from "../../mongo/token";
import makeSingletonFn from "../../utilities/createSingletonFunc";
import { TokenDoesNotExistError } from "../token/errors";
import { JWTEndpoint } from "../types";
import {
    wrapFireAndThrowErrorAsync,
    wrapFireAndThrowErrorRegular,
} from "../utils";
import { IBaseContext } from "./IBaseContext";
import jwt from "jsonwebtoken";
import { CredentialsExpiredError } from "../user/errors";

export const CURRENT_USER_TOKEN_VERSION = 5;

export interface IGeneralTokenSubject {
    id: string;
}

export interface IUserTokenSubject extends IGeneralTokenSubject {}

export interface IBaseTokenData<
    Sub extends IGeneralTokenSubject = IGeneralTokenSubject
> {
    version: number;
    sub: Sub;
    iat: number;
    // aud: string[];
    exp?: number;
}

export type IUserTokenData = IBaseTokenData<IUserTokenSubject>;

export interface ITokenContext {
    saveToken: (ctx: IBaseContext, token: IToken) => Promise<IToken>;
    getTokenById: (
        ctx: IBaseContext,
        customId: string
    ) => Promise<IToken | null>;
    getTokenByUserAndClientId: (
        ctx: IBaseContext,
        userId: string,
        clientId: string
    ) => Promise<IToken | null>;
    assertGetTokenById: (
        ctx: IBaseContext,
        customId: string
    ) => Promise<IToken>;
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
    decodeToken: (
        ctx: IBaseContext,
        token: string
    ) => IBaseTokenData<IGeneralTokenSubject>;
    containsAudience: (
        ctx: IBaseContext,
        tokenData: IToken,
        inputAud: JWTEndpoint
    ) => boolean;
    encodeToken: (
        ctx: IBaseContext,
        tokenId: string,
        expires?: number
    ) => string;
}

export default class TokenContext implements ITokenContext {
    public saveToken = wrapFireAndThrowErrorAsync(
        async (ctx: IBaseContext, data: IToken) => {
            const token = new ctx.models.tokenModel.model(data);
            return token.save();
        }
    );

    public getTokenById = wrapFireAndThrowErrorAsync(
        (ctx: IBaseContext, customId: string) => {
            return ctx.models.tokenModel.model
                .findOne({
                    customId,
                })
                .lean()
                .exec();
        }
    );

    public getTokenByUserAndClientId = wrapFireAndThrowErrorAsync(
        (ctx: IBaseContext, userId: string, clientId: string) => {
            return ctx.models.tokenModel.model
                .findOne({
                    userId,
                    clientId,
                })
                .lean()
                .exec();
        }
    );

    public assertGetTokenById = wrapFireAndThrowErrorAsync(
        async (ctx: IBaseContext, customId: string) => {
            const token = await ctx.token.getTokenById(ctx, customId);

            if (!token) {
                throw new TokenDoesNotExistError();
            }

            return token;
        }
    );

    public updateTokenById = wrapFireAndThrowErrorAsync(
        (ctx: IBaseContext, customId: string, data: Partial<IToken>) => {
            return ctx.models.tokenModel.model
                .findOneAndUpdate(
                    {
                        customId,
                    },
                    data,
                    { new: true }
                )
                .lean()
                .exec();
        }
    );

    public deleteTokenByUserAndClientId = wrapFireAndThrowErrorAsync(
        async (ctx: IBaseContext, clientId: string, userId: string) => {
            await ctx.models.tokenModel.model
                .deleteOne({
                    clientId,
                    userId,
                })
                .exec();
        }
    );

    public deleteTokenById = wrapFireAndThrowErrorAsync(
        async (ctx: IBaseContext, tokenId: string) => {
            await ctx.models.tokenModel.model
                .deleteOne({
                    customId: tokenId,
                })
                .exec();
        }
    );

    public deleteTokensByUserId = wrapFireAndThrowErrorAsync(
        async (ctx: IBaseContext, userId: string) => {
            await ctx.models.tokenModel.model
                .deleteMany({
                    userId,
                })
                .exec();
        }
    );

    public decodeToken = wrapFireAndThrowErrorRegular(
        (ctx: IBaseContext, token: string) => {
            const tokenData = jwt.verify(
                token,
                ctx.appVariables.jwtSecret
            ) as IBaseTokenData<IGeneralTokenSubject>;

            if (tokenData.version < CURRENT_USER_TOKEN_VERSION) {
                throw new CredentialsExpiredError();
            }

            return tokenData;
        }
    );

    public containsAudience = wrapFireAndThrowErrorAsync(
        (ctx: IBaseContext, tokenData: IToken, inputAud: JWTEndpoint) => {
            const audience = tokenData.audience;
            const hasAudience = !!audience.find(
                (nextAud) =>
                    nextAud === JWTEndpoint.Universal || nextAud === inputAud
            );

            return hasAudience;
        }
    );

    public encodeToken = wrapFireAndThrowErrorRegular(
        (ctx: IBaseContext, tokenId: string, expires?: number) => {
            const payload: Omit<IBaseTokenData, "iat"> = {
                // aud: audience || [],
                version: CURRENT_USER_TOKEN_VERSION,
                sub: {
                    id: tokenId,
                },
            };

            if (expires) {
                payload.exp = expires / 1000; // exp is in seconds
            }

            return jwt.sign(payload, ctx.appVariables.jwtSecret);
        }
    );
}

export const getTokenContext = makeSingletonFn(() => new TokenContext());
