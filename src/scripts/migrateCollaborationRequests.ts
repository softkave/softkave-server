import { Document } from "mongoose";
import { BlockType } from "../mongo/block";
import {
    CollaborationRequestEmailReason,
    getCollaborationRequestModel,
    ICollaborationRequest,
} from "../mongo/collaboration-request";
import { getDefaultConnection } from "../mongo/defaultConnection";
import MongoModel from "../mongo/MongoModel";
import {
    logScriptFailed,
    logScriptStarted,
    logScriptSuccessful,
} from "./utils";

const modelName = "notification-v2";
const collectionName = "notifications-v2";

interface ICollaborationRequestFrom {
    userId: string;
    name: string;
    blockId: string;
    blockName: string;
    blockType: BlockType;
}

const collaborationRequestFromSchema = {
    userId: { type: String, index: true },
    name: String,
    blockId: { type: String, index: true },
    blockName: String,
    blockType: String,
};

interface INotificationTo {
    email: string;
}

const notificationToSchema = {
    email: { type: String, index: true },
};

enum CollaborationRequestStatusType {
    Accepted = "accepted",
    Declined = "declined",
    Revoked = "revoked",
    Pending = "pending",
}

interface ICollaborationRequestStatus {
    status: CollaborationRequestStatusType;
    date: Date;
}

const collaborationRequestStatusHistorySchema = {
    status: String,
    date: Date,
};

interface INotificationSentEmailHistoryItem {
    date: Date;
}

const notificationSentEmailHistorySchema = {
    date: Date,
};

enum NotificationType {
    CollaborationRequest = "collab-req",
    RemoveCollaborator = "remove-collaborator",
    OrgDeleted = "org-deleted",
}

interface INotification {
    customId: string;
    to: INotificationTo;
    body: string;
    from?: ICollaborationRequestFrom;
    createdAt: Date;
    type: NotificationType;
    readAt?: Date;
    expiresAt?: Date;
    statusHistory?: ICollaborationRequestStatus[];
    sentEmailHistory?: INotificationSentEmailHistoryItem[];
}

const notificationSchema = {
    customId: { type: String, unique: true, index: true },
    to: { type: notificationToSchema },
    body: { type: String },
    from: { type: collaborationRequestFromSchema },
    createdAt: { type: Date },
    type: { type: String },
    readAt: { type: Date },
    expiresAt: { type: Date },
    statusHistory: { type: [collaborationRequestStatusHistorySchema] },
    sentEmailHistory: { type: [notificationSentEmailHistorySchema] },
};

interface INotificationDocument extends INotification, Document {}

export async function script_migrateCollaborationRequests() {
    logScriptStarted(script_migrateCollaborationRequests);

    const collaborationRequestModel = getCollaborationRequestModel();
    const notificationModel = new MongoModel<INotificationDocument>({
        modelName,
        collectionName,
        rawSchema: notificationSchema,
        connection: getDefaultConnection().getConnection(),
    });

    await collaborationRequestModel.waitTillReady();
    await notificationModel.waitTillReady();

    if ((await collaborationRequestModel.model.countDocuments()) > 0) {
        console.log("Collaboration requests migrated already");
        return;
    }

    let docsCount = 0;

    try {
        const requests = await notificationModel.model
            .find({
                type: NotificationType.CollaborationRequest,
            })
            .lean()
            .exec();

        const newRequests: ICollaborationRequest[] = requests.map((req) => {
            return {
                customId: req.customId,
                to: req.to,
                title: `Collaboration request from ${req.from.blockName}`,
                body: req.body,
                from: {
                    blockId: req.from.blockId,
                    userId: req.from.userId,
                    blockName: req.from.blockName,
                    blockType: req.from.blockType,
                    name: req.from.name,
                },
                createdAt: req.createdAt,
                expiresAt: req.expiresAt,
                readAt: req.readAt,
                statusHistory: req.statusHistory,
                sentEmailHistory: (req.sentEmailHistory || []).map((item) => {
                    return {
                        date: item.date,
                        reason:
                            CollaborationRequestEmailReason.RequestNotification,
                    };
                }),
            };
        });

        await collaborationRequestModel.model.insertMany(newRequests);
        docsCount = requests.length;

        console.log(`collaboration request(s) count = ${docsCount}`);
        logScriptSuccessful(script_migrateCollaborationRequests);
    } catch (error) {
        logScriptFailed(script_migrateCollaborationRequests, error);
    }
}
