import { Document } from "mongoose";
import { getDate } from "../../utilities/fns";

export const sprintSchemaVersion = 1;

export enum SprintDuration {
    OneWeek = "1 week",
    TwoWeeks = "2 weeks",
    OneMonth = "1 month",
}

export interface IBoardSprintOptions {
    duration: SprintDuration;
    updatedAt?: Date;
    updatedBy?: string;
    createdAt: Date;
    createdBy: string;
}

export const boardSprintOptionsSchema = {
    namingType: { type: String },
    duration: { type: String },
    createdAt: { type: Date, default: () => getDate() },
    createdBy: { type: String },
    updatedAt: { type: Date },
    updatedBy: { type: String },
};

export interface ISprint {
    customId: string;
    boardId: string;
    orgId: string;
    duration: SprintDuration;
    sprintIndex: number;
    name?: string;
    startDate?: Date;
    startedBy?: string;
    endDate?: Date;
    endedBy?: string;
}

const sprintSchema = {
    customId: { type: String, unique: true, index: true },
    boardId: { type: String },
    orgId: { type: String },
    duration: { type: String },
    sprintIndex: { type: Number },
    name: { type: String },
    startDate: { type: Date },
    startedBy: { type: String },
    endDate: { type: Date },
    endedBy: { type: String },
};

export default sprintSchema;
export interface ISprintDocument extends ISprint, Document {}
