import createSingletonFunc from "../../utilities/createSingletonFunc";
import { ServerError } from "../../utilities/errors";
import logger from "../../utilities/logger";
import { IGetGroupMessageParameters } from "../chat/group/type";
import { IGetPrivateMessageParameters } from "../chat/private/type";
import { IBaseContext } from "./BaseContext";

export interface IChatContext {
    getPrivateMessage(ctx: IBaseContext, data: IGetPrivateMessageParameters);
    getGroupMessage(ctx: IBaseContext, data: IGetGroupMessageParameters);
}

export default class ChatContext implements IChatContext {
    public async getPrivateMessage(
        ctx: IBaseContext,
        data: IGetPrivateMessageParameters
    ) {
        try {
            return await ctx.models.chatModel.model
                .find({
                    sender: { $in: [data.customId, data.recipientId] },
                    recipient: { $in: [data.recipientId, data.customId] },
                    // to avoid fetching messages from another organisation
                    // in case the sender and recipient are part of another organisation
                    organisationId: data.orgId,
                })
                .exec();
        } catch (error) {
            logger.error(error);
            throw new ServerError();
        }
    }

    public async getGroupMessage(
        ctx: IBaseContext,
        data: IGetGroupMessageParameters
    ) {
        try {
            return await ctx.models.chatModel.model
                .find({
                    customId: data.customId,
                })
                .exec();
        } catch (error) {
            logger.error(error);
            throw new ServerError();
        }
    }
}

export const getChatContext = createSingletonFunc(() => new ChatContext());
