import merge from "lodash/merge";
import moment from "moment";
import { resolveJWTError } from "../../middlewares/handleErrors";
import { IUser } from "../../mongo/user";
import makeSingletonFunc from "../../utilities/createSingletonFunc";
import { ServerError } from "../../utilities/errors";
import { PermissionDeniedError } from "../errors";
import RequestData from "../RequestData";
import { JWTEndpoints } from "../types";
import {
    InvalidCredentialsError,
    LoginAgainError,
    UserDoesNotExistError,
} from "../user/errors";
import UserToken, { IBaseUserTokenData } from "../user/UserToken";
import { wrapFireAndThrowError } from "../utils";
import { IBaseContext } from "./BaseContext";

// TODO: how can we validate user signin before getting to the endpoints that require user signin
// for security purposes, in case someone forgets to check

export interface ISessionContext {
    addUserToSession: (
        ctx: IBaseContext,
        data: RequestData,
        user: IUser
    ) => void;
    getUser: (ctx: IBaseContext, data: RequestData) => Promise<IUser>;
    getRequestToken: (
        ctx: IBaseContext,
        data: RequestData
    ) => IBaseUserTokenData;
    updateUser: (
        ctx: IBaseContext,
        data: RequestData,
        partialUserData: Partial<IUser>
    ) => Promise<IUser | undefined>;
    assertUser: (ctx: IBaseContext, data: RequestData) => Promise<boolean>;
    validateUserTokenData: (
        ctx: IBaseContext,
        tokenData: IBaseUserTokenData,
        required?: boolean,
        audience?: JWTEndpoints
    ) => Promise<IUser | undefined>;
    validateUserToken: (ctx: IBaseContext, token: string) => IBaseUserTokenData;
    tryGetUser: (
        ctx: IBaseContext,
        data: RequestData
    ) => Promise<IUser | undefined>;
    clearCachedUserData: (ctx: IBaseContext, data: RequestData) => void;
}

export default class SessionContext implements ISessionContext {
    private static async __getUser(
        ctx: IBaseContext,
        data: RequestData,
        required = true
    ): Promise<IUser | undefined> {
        if (data.req) {
            // TODO: not using cached data on multiple requests
            if (data.req.userData) {
                return data.req.userData;
            }

            const user = await ctx.session.validateUserTokenData(
                ctx,
                data.req.user,
                required,
                JWTEndpoints.Login
            );

            // TODO:
            // Caching the user data when we have multi-tenancy can be problematic
            // cause the user may have been updated before a string of requests are complete
            data.req.userData = user;
            return user;
        } else if (data.socket) {
            const userId = ctx.socket.getUserIdBySocketId(data);

            if (!userId) {
                if (required) {
                    throw new PermissionDeniedError();
                } else {
                    return;
                }
            }

            const user = await ctx.models.userModel.model
                .findOne({
                    customId: userId,
                })
                .exec();

            if (!user) {
                ctx.socket.disconnectUser(userId);
                throw new UserDoesNotExistError();
            }

            return user;
        }
    }

    public updateUser = wrapFireAndThrowError(
        async (
            ctx: IBaseContext,
            data: RequestData,
            partialUserData: Partial<IUser>
        ) => {
            const user = await this.getUser(ctx, data);

            // TODO: is this safe, and does it work?
            merge(user, partialUserData);

            return ctx.models.userModel.model
                .findOneAndUpdate({ customId: user.customId }, partialUserData)
                .lean()
                .exec();
        }
    );

    public clearCachedUserData(ctx: IBaseContext, data: RequestData) {
        if (data.req) {
            delete data.req.userData;
        }
    }

    public validateUserToken(ctx: IBaseContext, token: string) {
        try {
            const tokenData = UserToken.decodeToken(token);
            return tokenData;
        } catch (error) {
            console.error(error);
            const JWTError = resolveJWTError(error);

            if (JWTError) {
                throw JWTError;
            }

            throw new PermissionDeniedError();
        }
    }

    public async validateUserTokenData(
        ctx: IBaseContext,
        tokenData: IBaseUserTokenData,
        required: boolean = true,
        audience = JWTEndpoints.Login
    ) {
        if (!tokenData || !UserToken.containsAudience(tokenData, audience)) {
            if (required) {
                throw new InvalidCredentialsError();
            } else {
                return;
            }
        }

        let user: IUser = null;
        const query = {
            customId: tokenData.sub.id,
        };

        user = await ctx.models.userModel.model.findOne(query).exec();

        if (!user) {
            throw new UserDoesNotExistError();
        }

        const userPasswordLastChangedAt = user.passwordLastChangedAt;
        const tokenPasswordLastChangedAt = UserToken.getPasswordLastChangedAt(
            tokenData
        );

        // validate password changes to logout user if using old password or old token format
        if (
            !userPasswordLastChangedAt ||
            !tokenPasswordLastChangedAt ||
            moment(userPasswordLastChangedAt) >
                moment(tokenPasswordLastChangedAt)
        ) {
            throw new LoginAgainError();
        }

        return user;
    }

    public addUserToSession(ctx: IBaseContext, data: RequestData, user: IUser) {
        if (data.req) {
            data.req.userData = user;
        } else if (data.socket) {
            ctx.socket.mapUserToSocketId(data, user);
        }
    }

    public async getUser(ctx: IBaseContext, data: RequestData) {
        return SessionContext.__getUser(ctx, data);
    }

    public async assertUser(ctx: IBaseContext, data: RequestData) {
        return !!SessionContext.__getUser(ctx, data);
    }

    public async tryGetUser(ctx: IBaseContext, data: RequestData) {
        return SessionContext.__getUser(ctx, data, false);
    }

    public getRequestToken(ctx: IBaseContext, data: RequestData) {
        const tokenData = data.tokenData;

        if (!tokenData) {
            throw new InvalidCredentialsError();
        }

        return tokenData;
    }
}

export const getSessionContext = makeSingletonFunc(() => new SessionContext());
