import {
    blockAssignedLabelSchema,
    blockAssigneeSchema,
    blockLabelSchema,
    BlockPriority,
    blockStatusSchema,
    BlockType,
    boardStatusResolutionSchema,
    getBlockModel,
    IBlock,
    IBlockDocument,
    ITaskSprint,
    subTaskSchema,
    taskSprintSchema,
} from "../mongo/block";
import { getChatModel, IChat } from "../mongo/chat";
import { getDefaultConnection } from "../mongo/defaultConnection";
import MongoModel from "../mongo/MongoModel";
import { getRoomModel, IRoom } from "../mongo/room";
import {
    boardSprintOptionsSchema,
    getSprintModel,
    IBoardSprintOptions,
    ISprint,
} from "../mongo/sprint";
import {
    logScriptFailed,
    logScriptStarted,
    logScriptSuccessful,
} from "./utils";
import { Document } from "mongoose";
import { omit } from "lodash";
import { getDate } from "../utilities/fns";

// block - lowerCasedName, defaults, model name version

/**
 * Block
 * - Remove lowercasedName
 * - Move data to blocks-v4 from blocks-v3
 * - Change priority to 'high', 'medium', and 'low'
 */

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
    type: BlockType;
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

type IOldBlockDocument = IOldBlock & Document;

interface IMoveFnResult {
    successful: boolean;
    error?: Error;
}

const priorityChangeMap = {
    [BlockPriority.High]: "high",
    [BlockPriority.Medium]: "medium",
    [BlockPriority.Low]: "low",
};

const connection = getDefaultConnection().getConnection();

async function moveOrgs(
    oldBlockModel: MongoModel<IOldBlockDocument>,
    newBlockModel: MongoModel<IBlockDocument>
) {
    try {
        const oldBlocks = await oldBlockModel.model
            .find({ type: { $in: [BlockType.Organization, BlockType.Root] } })
            .exec();
        const newBlocks: IBlock[] = oldBlocks.map((item) => {
            const block: IBlock = {
                customId: item.customId,
                createdBy: item.createdBy,
                createdAt: item.createdAt,
                type: item.type,
                name: item.name,
                description: item.description,
                updatedAt: item.updatedAt,
                updatedBy: item.updatedBy,
                parent: item.parent,
                rootBlockId: item.rootBlockId,
                isDeleted: item.isDeleted,
                deletedAt: item.deletedAt,
                deletedBy: item.deletedBy,
                permissionResourceId: item.permissionResourceId,

                // Organizations and boards
                color: item.color,
                publicPermissionGroupId: item.publicPermissionGroupId,

                // Boards
                boardStatuses: [],
                boardLabels: [],
                boardResolutions: [],

                // Tasks
                assignees: [],
                subTasks: [],
                labels: [],
            };

            return block;
        });

        await newBlockModel.model.insertMany(newBlocks);
        return { success: true, task: moveOrgs.name };
    } catch (error) {
        return { error, success: false, task: moveOrgs.name };
    }
}

async function moveBoards(
    oldBlockModel: MongoModel<IOldBlockDocument>,
    newBlockModel: MongoModel<IBlockDocument>
) {
    try {
        const oldBlocks = await oldBlockModel.model
            .find({ type: BlockType.Board })
            .exec();
        const newBlocks: IBlock[] = oldBlocks.map((item) => {
            const block: IBlock = {
                customId: item.customId,
                createdBy: item.createdBy,
                createdAt: item.createdAt,
                type: item.type,
                name: item.name,
                description: item.description,
                updatedAt: item.updatedAt,
                updatedBy: item.updatedBy,
                parent: item.parent,
                rootBlockId: item.rootBlockId,
                isDeleted: item.isDeleted,
                deletedAt: item.deletedAt,
                deletedBy: item.deletedBy,
                permissionResourceId: item.permissionResourceId,

                // Organizations and boards
                color: item.color,
                publicPermissionGroupId: item.publicPermissionGroupId,

                // Boards
                boardStatuses: item.boardStatuses || [],
                boardLabels: item.boardLabels || [],
                boardResolutions: item.boardResolutions || [],
                currentSprintId: item.currentSprintId,
                sprintOptions: item.sprintOptions,
                lastSprintId: item.lastSprintId,

                // Tasks
                assignees: [],
                subTasks: [],
                labels: [],
            };

            return block;
        });

        await newBlockModel.model.insertMany(newBlocks);
        return { success: true, task: moveBoards.name };
    } catch (error) {
        return { error, success: false, task: moveBoards.name };
    }
}

async function moveTasks(
    oldBlockModel: MongoModel<IOldBlockDocument>,
    newBlockModel: MongoModel<IBlockDocument>
) {
    try {
        const oldBlocks = await oldBlockModel.model
            .find({ type: BlockType.Task })
            .exec();
        const newBlocks: IBlock[] = oldBlocks.map((item) => {
            const block: IBlock = {
                customId: item.customId,
                createdBy: item.createdBy,
                createdAt: item.createdAt,
                type: item.type,
                name: item.name,
                description: item.description,
                updatedAt: item.updatedAt,
                updatedBy: item.updatedBy,
                parent: item.parent,
                rootBlockId: item.rootBlockId,
                isDeleted: item.isDeleted,
                deletedAt: item.deletedAt,
                deletedBy: item.deletedBy,
                permissionResourceId: item.permissionResourceId,

                // Boards
                boardStatuses: [],
                boardLabels: [],
                boardResolutions: [],

                // Tasks
                assignees: item.assignees || [],
                priority:
                    priorityChangeMap[item.priority] || BlockPriority.Medium,
                subTasks: item.subTasks || [],
                status: item.status,
                statusAssignedBy: item.statusAssignedBy,
                statusAssignedAt: item.statusAssignedAt,
                taskResolution: item.taskResolution,
                labels: item.labels || [],
                dueAt: item.dueAt,
                taskSprint: item.taskSprint,
            };

            return block;
        });

        await newBlockModel.model.insertMany(newBlocks);
        return { success: true, task: moveTasks.name };
    } catch (error) {
        return { error, success: false, task: moveTasks.name };
    }
}

async function getModels() {
    const newBlockModel = getBlockModel();
    const oldBlockModel = new MongoModel<IOldBlockDocument>({
        modelName: "block-v3",
        collectionName: "blocks-v3",
        rawSchema: {
            // General
            customId: { type: String, unique: true, index: true },
            name: { type: String },
            lowerCasedName: { type: String, index: true },
            description: { type: String },
            createdAt: { type: Date, default: () => getDate() },
            createdBy: { type: String },
            updatedAt: { type: Date },
            updatedBy: { type: String },
            type: { type: String, index: true },
            parent: { type: String, index: true },
            rootBlockId: { type: String },
            isDeleted: { type: Boolean, default: false, index: true },
            deletedAt: { type: Date },
            deletedBy: { type: String },
            permissionResourceId: { type: String },

            // Orgs and boards
            color: { type: String },
            publicPermissionGroupId: { type: String },

            // Tasks
            assignees: { type: [blockAssigneeSchema] },
            priority: { type: String },
            subTasks: { type: [subTaskSchema] },
            dueAt: { type: Date },
            status: { type: String },
            statusAssignedBy: { type: String },
            statusAssignedAt: { type: Date },
            taskResolution: { type: String },
            labels: { type: [blockAssignedLabelSchema] },
            taskSprint: { type: taskSprintSchema },

            // Boards
            boardStatuses: { type: [blockStatusSchema] },
            boardLabels: { type: [blockLabelSchema] },
            boardResolutions: { type: boardStatusResolutionSchema },
            currentSprintId: { type: String },
            sprintOptions: { type: boardSprintOptionsSchema },
            lastSprintId: { type: String },
        },
        connection: connection,
    });

    oldBlockModel.waitTillReady();
    newBlockModel.waitTillReady();
    return { oldBlockModel, newBlockModel };
}

export async function script_MigrateToNewDataDefinitions() {
    logScriptStarted(script_MigrateToNewDataDefinitions);
    const { newBlockModel, oldBlockModel } = await getModels();

    try {
        const moveResult = await Promise.all([
            moveOrgs(oldBlockModel, newBlockModel),
            moveBoards(oldBlockModel, newBlockModel),
            moveTasks(oldBlockModel, newBlockModel),
        ]);

        moveResult.forEach((result) => {
            if (result.success) {
                console.log("Task: ", result.task, " - succeeded");
            } else if (result.error) {
                console.log("Task: ", result.task, " - failed with error");
                console.log(result.error);
            }
        });
        logScriptSuccessful(script_MigrateToNewDataDefinitions);
    } catch (error) {
        logScriptFailed(script_MigrateToNewDataDefinitions, error);
    }
}
