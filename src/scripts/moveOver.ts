import {
    blockAssignedLabelSchema,
    blockAssigneeSchema,
    blockLabelSchema,
    blockStatusSchema,
    boardStatusResolutionSchema,
    getBlockModel,
    subTaskSchema,
} from "../mongo/block";
import { getChatModel } from "../mongo/chat";
import { getCollaborationRequestModel } from "../mongo/collaboration-request";
import { getDefaultConnection } from "../mongo/defaultConnection";
import MongoModel from "../mongo/MongoModel";
import { getRoomModel } from "../mongo/room";
import { getSprintModel } from "../mongo/sprint";
import { getUnseenChatsModel } from "../mongo/unseen-chats";
import { getUserModel } from "../mongo/user";
import {
    logScriptFailed,
    logScriptStarted,
    logScriptSuccessful,
} from "./utils";
import { Document } from "mongoose";

// block - orgId, defaults, model name version
// chat - orgId, model name version
// collaboration-request - orgId, model name, model name version
// room - orgId, model name version
// sprint - orgId, model name version
// unseen-chats - orgId, model name version
// user - orgId, model name version

const priorityMap = {
    "very important": "high",
    important: "medium",
    "not important": "low",
};

const connection = getDefaultConnection().getConnection();
const oldBlockModel = new MongoModel<
    Document & {
        type: any;
        assignees: any;
        priority: any;
        subTasks: any;
        labels: any;
        boardStatuses: any;
        boardLabels: any;
        boardResolutions: any;
    }
>({
    modelName: "block-v3",
    collectionName: "blocks-v3",
    rawSchema: {
        type: { type: String, index: true },
        assignees: { type: [blockAssigneeSchema], default: [] },
        priority: { type: String },
        subTasks: { type: [subTaskSchema], default: [] },
        labels: { type: [blockAssignedLabelSchema], default: [] },
        boardStatuses: { type: [blockStatusSchema], default: [] },
        boardLabels: { type: [blockLabelSchema], default: [] },
        boardResolutions: { type: boardStatusResolutionSchema, default: [] },
    },
    connection: connection,
});

const oldChatModel = new MongoModel<{ organizationId: string }>({
    modelName: "chat",
    collectionName: "chats",
    rawSchema: { organizationId: { type: String } },
    connection: connection,
});

const oldRequestsModel = new MongoModel<IBlockDocument>({
    modelName,
    collectionName,
    rawSchema: blockSchema,
    connection: conn,
});

const oldRoomModel = new MongoModel<IBlockDocument>({
    modelName,
    collectionName,
    rawSchema: blockSchema,
    connection: conn,
});

const oldSprintModel = new MongoModel<IBlockDocument>({
    modelName,
    collectionName,
    rawSchema: blockSchema,
    connection: conn,
});

const oldUnseenChatsModel = new MongoModel<IBlockDocument>({
    modelName,
    collectionName,
    rawSchema: blockSchema,
    connection: conn,
});

const oldUserModel = new MongoModel<IBlockDocument>({
    modelName,
    collectionName,
    rawSchema: blockSchema,
    connection: conn,
});

export async function script_removeDeletedBlocks() {
    logScriptStarted(script_removeDeletedBlocks);

    const newBlockModel = getBlockModel();
    const newChatModel = getChatModel();
    const newRequestsModel = getCollaborationRequestModel();
    const newRoomModel = getRoomModel();
    const newSprintModel = getSprintModel();
    const newUnseenChatsModel = getUnseenChatsModel();
    const newUserModel = getUserModel();

    const oldBlockModel = getBlockModel();
    const oldChatModel = getChatModel();
    const oldRequestsModel = getCollaborationRequestModel();
    const oldRoomModel = getRoomModel();
    const oldSprintModel = getSprintModel();
    const oldUnseenChatsModel = getUnseenChatsModel();
    const oldUserModel = getUserModel();

    try {
        await newBlockModel.waitTillReady();
        await newBlockModel.model
            .deleteMany({
                isDeleted: true,
            })
            .exec();
        logScriptSuccessful(script_removeDeletedBlocks);
    } catch (error) {
        logScriptFailed(script_removeDeletedBlocks, error);
    }
}
