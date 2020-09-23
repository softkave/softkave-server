import { IChat } from "../../mongo/chat";
import createSingletonFunc from "../../utilities/createSingletonFunc";
import { ServerError } from "../../utilities/errors";
import logger from "../../utilities/logger";
import { IGetChatListParameters } from "../chat/getChatList/types";
import { IGetGroupListParameters } from "../chat/getGroupList/types";
import { IGetGroupMessageParameters } from "../chat/group/type";
import { IGetPrivateMessageParameters } from "../chat/private/type";
import { IBaseContext } from "./BaseContext";

export interface IChatContext {
    getPrivateChatList(ctx: IBaseContext, data: IGetChatListParameters);
    getGroupList(ctx: IBaseContext, data: IGetGroupListParameters);
    getPrivateMessage(ctx: IBaseContext, data: IGetPrivateMessageParameters);
    getGroupMessage(ctx: IBaseContext, data: IGetGroupMessageParameters);
    insertPrivateMessage(ctx: IBaseContext, data: IChat);
}

export default class ChatContext implements IChatContext {
    public async getPrivateChatList(
        ctx: IBaseContext,
        data: IGetChatListParameters
    ) {
        try {
            return await ctx.models.userModel.model.find({
                //TODO
                // Retrieve all users in an organisation
                // orgs:
            });
        } catch (error) {
            logger.error(error);
            throw new ServerError();
        }
    }

    public async getGroupList(
        ctx: IBaseContext,
        data: IGetGroupListParameters
    ) {
        try {
            return await ctx.models.groupModel.model.find({
                //TODO
                // Retrieve all groups user belongs to
                // orgs:
            });
        } catch (error) {
            logger.error(error);
            throw new ServerError();
        }
    }

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

    public async insertPrivateMessage(ctx: IBaseContext, data: IChat) {
        try {
            const c = new ctx.models.chatModel.model(data);
            await c.save();
            return c;
        } catch (error) {
            logger.error(error);
            throw new ServerError();
        }
    }
}

export const getChatContext = createSingletonFunc(() => new ChatContext());
