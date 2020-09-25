import { Document } from "mongoose";
import { getDate } from "../../utilities/fns";

export const sprintSchemaVersion = 1;

export interface IBoardSprintDefinition {
    duration: string;
    createdAt: Date;
    createdBy: string;
    updatedAt?: Date;
    updatedBy?: string;
}

export const boardSprintDefinitionSchema = {
    createdAt: { type: Date, default: getDate },
    createdBy: { type: String },
    updatedAt: { type: Date },
    updatedBy: { type: String },
    duration: { type: String },
};

export interface ISprint extends IBoardSprintDefinition {
    customId: string;
    parentId: string;
    rootBlockId: string;
    estimatedStartYear: number;
    yearIteration: number;
    overallIteration: number;
    startDate?: Date;
    startedBy?: string;
    endDate?: Date;
    endedBy?: string;

    // TODO: should we implement same delete strategy as in blocks
}

const sprintSchema = {
    ...boardSprintDefinitionSchema,
    customId: { type: String, unique: true, index: true },
    estimatedStartYear: { type: Number },
    yearIteration: { type: Number },
    overallIteration: { type: Number },
    parentId: { type: String },
    rootBlockId: { type: String },
    startDate: { type: Date },
    startedBy: { type: String },
    endDate: { type: Date },
    endedBy: { type: String },
};

export default sprintSchema;
export interface ISprintDocument extends ISprint, Document {}
