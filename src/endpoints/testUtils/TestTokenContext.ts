import { IToken } from "../../mongo/token";
import makeSingletonFn from "../../utilities/createSingletonFunc";
import { IBaseContext } from "../contexts/BaseContext";
import TokenContext, { ITokenContext } from "../contexts/TokenContext";
import { TokenDoesNotExistError } from "../token/errors";

const tokens: IToken[] = [];

class TestTokenContext extends TokenContext implements ITokenContext {
    public saveToken = async (ctx: IBaseContext, data: IToken) => {
        tokens.push(data);
        return tokens[tokens.length - 1] as any;
    };

    public getTokenById = async (ctx: IBaseContext, customId: string) => {
        return tokens.find((token) => token.customId === customId);
    };

    public getTokenByUserAndClientId = async (
        ctx: IBaseContext,
        userId: string,
        clientId: string
    ) => {
        return tokens.find(
            (token) => token.userId === userId && token.clientId === clientId
        );
    };

    public assertGetTokenById = async (ctx: IBaseContext, customId: string) => {
        const token = await ctx.token.getTokenById(ctx, customId);

        if (!token) {
            throw new TokenDoesNotExistError();
        }

        return token;
    };

    public updateTokenById = async (
        ctx: IBaseContext,
        customId: string,
        data: Partial<IToken>
    ) => {
        const index = tokens.findIndex((token) => token.customId === customId);

        if (index !== -1) {
            tokens[index] = { ...tokens[index], ...data };
            return tokens[index];
        }
    };

    public deleteTokenByUserAndClientId = async (
        ctx: IBaseContext,
        clientId: string,
        userId: string
    ) => {
        const index = tokens.findIndex(
            (token) => token.clientId === clientId && token.userId === userId
        );

        if (index !== -1) {
            tokens.splice(index, 1);
        }
    };

    public deleteTokenById = async (ctx: IBaseContext, tokenId: string) => {
        const index = tokens.findIndex((token) => token.customId === tokenId);

        if (index !== -1) {
            tokens.splice(index, 1);
        }
    };

    public deleteTokensByUserId = async (ctx: IBaseContext, userId: string) => {
        tokens
            .reduce((indexes, token, i) => {
                if (token.userId === userId) {
                    indexes.push(i);
                }

                return indexes;
            }, [])
            .forEach((index) => tokens.splice(index, 1));
    };
}

export const getTestTokenContext = makeSingletonFn(
    () => new TestTokenContext()
);
