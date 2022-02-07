import { IToken } from "../../../mongo/token";
import makeSingletonFn from "../../../utilities/createSingletonFunc";
import { IBaseContext } from "../../contexts/IBaseContext";
import TokenContext, { ITokenContext } from "../../contexts/TokenContext";
import { TokenDoesNotExistError } from "../../token/errors";

class TestTokenContext extends TokenContext implements ITokenContext {
    tokens: IToken[] = [];

    public saveToken = async (ctx: IBaseContext, data: IToken) => {
        this.tokens.push(data);
        return this.tokens[this.tokens.length - 1] as any;
    };

    public getTokenById = async (ctx: IBaseContext, customId: string) => {
        return this.tokens.find((token) => token.customId === customId);
    };

    public getTokenByUserAndClientId = async (
        ctx: IBaseContext,
        userId: string,
        clientId: string
    ) => {
        return this.tokens.find(
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
        const index = this.tokens.findIndex(
            (token) => token.customId === customId
        );

        if (index !== -1) {
            this.tokens[index] = { ...this.tokens[index], ...data };
            return this.tokens[index];
        }
    };

    public deleteTokenByUserAndClientId = async (
        ctx: IBaseContext,
        clientId: string,
        userId: string
    ) => {
        const index = this.tokens.findIndex(
            (token) => token.clientId === clientId && token.userId === userId
        );

        if (index !== -1) {
            this.tokens.splice(index, 1);
        }
    };

    public deleteTokenById = async (ctx: IBaseContext, tokenId: string) => {
        const index = this.tokens.findIndex(
            (token) => token.customId === tokenId
        );

        if (index !== -1) {
            this.tokens.splice(index, 1);
        }
    };

    public deleteTokensByUserId = async (ctx: IBaseContext, userId: string) => {
        this.tokens
            .reduce((indexes, token, i) => {
                if (token.userId === userId) {
                    indexes.push(i);
                }

                return indexes;
            }, [])
            .forEach((index) => this.tokens.splice(index, 1));
    };
}

export const getTestTokenContext = makeSingletonFn(
    () => new TestTokenContext()
);
