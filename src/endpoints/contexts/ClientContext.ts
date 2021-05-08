import { IClient } from "../../mongo/client";
import makeSingletonFunc from "../../utilities/createSingletonFunc";
import { ClientDoesNotExistError } from "../client/errors";
import { wrapFireAndThrowError } from "../utils";
import { IBaseContext } from "./BaseContext";

export interface IClientContext {
    saveClient: (ctx: IBaseContext, client: IClient) => Promise<IClient>;
    getClientById: (
        ctx: IBaseContext,
        customId: string
    ) => Promise<IClient | null>;
    assertGetClientById: (
        ctx: IBaseContext,
        customId: string
    ) => Promise<IClient>;
    updateClientByClientAndUserId: (
        ctx: IBaseContext,
        customId: string,
        userId: string,
        data: Partial<IClient>
    ) => Promise<IClient | null>;
}

export default class ClientContext implements IClientContext {
    public saveClient = wrapFireAndThrowError(
        async (ctx: IBaseContext, data: IClient) => {
            const client = new ctx.models.clientModel.model(data);
            return client.save();
        }
    );

    public getClientById = wrapFireAndThrowError(
        (ctx: IBaseContext, customId: string) => {
            return ctx.models.clientModel.model
                .findOne({
                    customId,
                })
                .lean()
                .exec();
        }
    );

    public assertGetClientById = wrapFireAndThrowError(
        async (ctx: IBaseContext, customId: string) => {
            const client = await ctx.client.getClientById(ctx, customId);

            if (!client) {
                throw new ClientDoesNotExistError();
            }

            return client;
        }
    );

    public updateClientByClientAndUserId = wrapFireAndThrowError(
        (
            ctx: IBaseContext,
            customId: string,
            userId: string,
            data: Partial<IClient>
        ) => {
            return ctx.models.clientModel.model
                .findOneAndUpdate(
                    {
                        customId,
                        userId,
                    },
                    data,
                    { new: true }
                )
                .lean()
                .exec();
        }
    );
}

export const getClientContext = makeSingletonFunc(() => new ClientContext());
