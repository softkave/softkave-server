import merge from "lodash/merge";
import moment from "moment";
import { resolveJWTError } from "../../middlewares/handleErrors";
import { IUser } from "../../mongo/user";
import createSingletonFunc from "../../utilities/createSingletonFunc";
import { ServerError } from "../../utilities/errors";
import { PermissionDeniedError } from "../errors";
import { JWTEndpoints } from "../types";
import { InvalidCredentialsError, LoginAgainError } from "../user/errors";
import UserToken, { IBaseUserTokenData } from "../user/UserToken";
import { IBaseContext } from "./BaseContext";
import RequestData from "./RequestData";

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
    ) => Promise<void>;
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

            if (!user) {
                return;
            }

            data.req.userData = user;
            return user;
        } else if (data.socket) {
            const user = ctx.socket.getUserBySocketId(data);

            if (!user) {
                if (required) {
                    throw new PermissionDeniedError();
                } else {
                    return;
                }
            }

            return user;
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
            throw new PermissionDeniedError();
        }

        const userPasswordLastChangedAt = moment(user.passwordLastChangedAt);
        const tokenDataPasswordLastChangedAt = moment(
            tokenData.sub.passwordLastChangedAt
        );

        // validate password changes to logout user if using old password
        if (
            !tokenData.sub.passwordLastChangedAt ||
            !user.passwordLastChangedAt ||
            userPasswordLastChangedAt > tokenDataPasswordLastChangedAt
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

    public async updateUser(
        ctx: IBaseContext,
        data: RequestData,
        partialUserData: Partial<IUser>
    ) {
        const user = await this.getUser(ctx, data);

        // TODO: is this safe, and does it work?
        merge(user, partialUserData);

        try {
            await ctx.models.userModel.model
                .updateOne({ customId: user.customId }, partialUserData)
                .exec();
        } catch (error) {
            console.error(error);
            throw new ServerError();
        }
    }
}

export const getSessionContext = createSingletonFunc(
    () => new SessionContext()
);
