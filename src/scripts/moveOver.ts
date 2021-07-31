import {
    blockAssignedLabelSchema,
    blockAssigneeSchema,
    blockLabelSchema,
    blockStatusSchema,
    boardStatusResolutionSchema,
    getBlockModel,
    IBlock,
    ITaskSprint,
    subTaskSchema,
} from "../mongo/block";
import { getChatModel, IChat } from "../mongo/chat";
import { getDefaultConnection } from "../mongo/defaultConnection";
import MongoModel from "../mongo/MongoModel";
import { getRoomModel, IRoom } from "../mongo/room";
import { getSprintModel, IBoardSprintOptions, ISprint } from "../mongo/sprint";
import {
    logScriptFailed,
    logScriptStarted,
    logScriptSuccessful,
} from "./utils";
import { Document } from "mongoose";

// block - block type (org), lowerCasedName, defaults, model name version
// chat - orgId, model name version
// room - orgId, model name version
// sprint - orgId, model name version

enum OldBlockType {
    Root = "root",
    Org = "org",
    Board = "board",
    Task = "task",
}

interface IOldBlock {
    // existing
    customId: string;
    createdBy: string;
    createdAt: Date;
    name?: string;
    lowerCasedName?: string;
    description?: string;
    updatedAt?: Date;
    updatedBy?: string;
    parent?: string;
    rootBlockId?: string;
    isDeleted?: boolean;
    deletedAt?: Date;
    deletedBy?: string;
    permissionResourceId?: string;
    color?: string;
    publicPermissionGroupId?: string;
    status?: string;
    statusAssignedBy?: string;
    statusAssignedAt?: Date;
    taskResolution?: string;
    dueAt?: Date;
    taskSprint?: ITaskSprint;
    currentSprintId?: string;
    sprintOptions?: IBoardSprintOptions;
    lastSprintId?: string;

    // updated
    type: OldBlockType;
    assignees?: any[];
    priority: string;
    subTasks: any[];
    labels: any[];
    boardStatuses: any[];
    boardLabels: any[];
    boardResolutions: any[];
}

interface IOrganizationChange {
    orgId: string;
}

type IOldChat = Omit<IChat, "organizationId"> & IOrganizationChange;
type IOldRoom = Omit<IRoom, "organizationId"> & IOrganizationChange;
type IOldSprint = Omit<ISprint, "organizationId"> & IOrganizationChange;

type IOldBlockDocument = IOldBlock & Document;
type IOldChatDocument = IOldChat & Document;
type IOldRoomDocument = IOldRoom & Document;
type IOldSprintDocument = IOldSprint & Document;

interface IMoveFnResult {
    successful: boolean;
    error?: Error;
}

const currentPriorityMap = {
    "very important": "high",
    important: "medium",
    "not important": "low",
};

const connection = getDefaultConnection().getConnection();

async function moveChats(): Promise<IMoveFnResult> {
    const newChatModel = getChatModel();
    const oldChatModel = new MongoModel<IOldChatDocument>({
        modelName: "chat",
        collectionName: "chats",
        rawSchema: { organizationId: { type: String } },
        connection: connection,
    });

    try {
        const oldChats = await oldChatModel.model.find({}).exec();
        const newChats: IChat[] = oldChats.map((item) => ({
            customId: item.customId,
            organizationId: item.orgId,
            message: item.message,
            sender: item.sender,
            roomId: item.roomId,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
        }));

        await newChatModel.model.insertMany(newChats);
        return { successful: true };
    } catch (error) {
        return { error, successful: false };
    }
}

async function moveRooms(): Promise<IMoveFnResult> {
    const newRoomModel = getRoomModel();
    const oldRoomModel = new MongoModel<IOldRoomDocument>({
        modelName: "room",
        collectionName: "rooms",
        rawSchema: { organizationId: { type: String } },
        connection: connection,
    });

    try {
        const oldRooms = await oldRoomModel.model.find({}).exec();
        const newRooms: IRoom[] = oldRooms.map((item) => ({
            customId: item.customId,
            name: item.name,
            organizationId: item.orgId,
            createdAt: item.createdAt,
            createdBy: item.createdBy,
            members: item.members,
            updatedAt: item.updatedAt,
            updatedBy: item.updatedBy,
        }));

        await newRoomModel.model.insertMany(newRooms);
        return { successful: true };
    } catch (error) {
        return { error, successful: false };
    }
}

async function moveSprints(): Promise<IMoveFnResult> {
    const newSprintModel = getSprintModel();
    const oldSprintModel = new MongoModel<IOldSprintDocument>({
        modelName: "sprint",
        collectionName: "sprints",
        rawSchema: { organizationId: { type: String } },
        connection: connection,
    });

    try {
        const oldSprints = await oldSprintModel.model.find({}).exec();
        const newSprints: ISprint[] = oldSprints.map((item) => ({
            customId: item.customId,
            boardId: item.boardId,
            organizationId: item.orgId,
            duration: item.duration,
            createdAt: item.createdAt,
            createdBy: item.createdBy,
            name: item.name,
            sprintIndex: item.sprintIndex,
            prevSprintId: item.prevSprintId,
            nextSprintId: item.nextSprintId,
            startDate: item.startDate,
            startedBy: item.startedBy,
            endDate: item.endDate,
            endedBy: item.endedBy,
            updatedAt: item.updatedAt,
            updatedBy: item.updatedBy,
        }));

        await newSprintModel.model.insertMany(newSprints);
        return { successful: true };
    } catch (error) {
        return { error, successful: false };
    }
}

async function moveBlocks(): Promise<IMoveFnResult> {
    const newBlockModel = getBlockModel();
    const oldBlockModel = new MongoModel<IOldBlockDocument>({
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
            boardResolutions: {
                type: boardStatusResolutionSchema,
                default: [],
            },
        },
        connection: connection,
    });

    try {
        const oldBlocks = await oldBlockModel.model.find({}).exec();
        const newBlocks: IBlock[] = oldBlocks.map((item) => {
            const baseBlock: Omit<IBlock, "type" | "priority"> = {};
        });

        await newBlockModel.model.insertMany(newSprints);
        return { successful: true };
    } catch (error) {
        return { error, successful: false };
    }
}

export async function script_removeDeletedBlocks() {
    logScriptStarted(script_removeDeletedBlocks);

    const newBlockModel = getBlockModel();
    const newChatModel = getChatModel();
    const newRoomModel = getRoomModel();
    const newSprintModel = getSprintModel();

    try {
        const oldChats = await oldChatModel.model.find({}).exec();
        const newChats: IChat[] = oldChats.map((item) => ({
            customId: item.customId,
            organizationId: item.orgId,
            message: item.message,
            sender: item.sender,
            roomId: item.roomId,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
        }));

        await newChatModel.model.insertMany(newChats);
    } catch (error) {}

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
