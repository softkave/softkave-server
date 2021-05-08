import { IToken } from "../../mongo/token";
import makeSingletonFunc from "../../utilities/createSingletonFunc";
import { TokenDoesNotExistError } from "../token/errors";
import { wrapFireAndThrowError } from "../utils";
import { IBaseContext } from "./BaseContext";

export interface ITokenContext {
    saveToken: (ctx: IBaseContext, token: IToken) => Promise<IToken>;
    getTokenById: (
        ctx: IBaseContext,
        customId: string
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
}

export default class TokenContext implements ITokenContext {
    public saveToken = wrapFireAndThrowError(
        async (ctx: IBaseContext, data: IToken) => {
            const token = new ctx.models.tokenModel.model(data);
            return token.save();
        }
    );

    public getTokenById = wrapFireAndThrowError(
        (ctx: IBaseContext, customId: string) => {
            return ctx.models.tokenModel.model
                .findOne({
                    customId,
                })
                .lean()
                .exec();
        }
    );

    public assertGetTokenById = wrapFireAndThrowError(
        async (ctx: IBaseContext, customId: string) => {
            const token = await ctx.token.getTokenById(ctx, customId);

            if (!token) {
                throw new TokenDoesNotExistError();
            }

            return token;
        }
    );

    public updateTokenById = wrapFireAndThrowError(
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

    public deleteTokenByUserAndClientId = wrapFireAndThrowError(
        async (ctx: IBaseContext, clientId: string, userId: string) => {
            await ctx.models.tokenModel.model
                .deleteOne({
                    clientId,
                    userId,
                })
                .exec();
        }
    );

    public deleteTokenById = wrapFireAndThrowError(
        async (ctx: IBaseContext, tokenId: string) => {
            await ctx.models.tokenModel.model
                .deleteOne({
                    customId: tokenId,
                })
                .exec();
        }
    );

    public deleteTokensByUserId = wrapFireAndThrowError(
        async (ctx: IBaseContext, userId: string) => {
            await ctx.models.tokenModel.model
                .deleteMany({
                    userId,
                })
                .exec();
        }
    );
}

export const getTokenContext = makeSingletonFunc(() => new TokenContext());
