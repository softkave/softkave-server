import { Document } from "mongoose";
import { getDate } from "../../utilities/fns";

export enum TaskHistoryAction {
    StatusUpdated = "status-updated",
}

export interface ITaskHistoryItem {
    customId: string;
    organizationId: string;
    boardId: string;
    taskId: string;
    action: TaskHistoryAction;

    // For TaskHistoryAction.StatusUpdated, it will be the status ID
    value?: string;
    createdAt: string;
    createdBy: string;
    timeToStage?: number;
    timeSpentSoFar?: number;
}

const taskHistoryItemSchema = {
    customId: { type: String, unique: true, index: true },
    organizationId: { type: String },
    boardId: { type: String },
    taskId: { type: String },
    action: { type: String },
    value: { type: String },
    createdAt: { type: Date, default: () => getDate() },
    createdBy: { type: String },
    timeToStage: { type: Number },
    timeSpentSoFar: { type: Number },
};

export default taskHistoryItemSchema;
export interface ITaskHistoryItemDocument extends ITaskHistoryItem, Document {}
