import { Document } from "mongoose";
import { getDate } from "../../utilities/fns";

export enum JobType {}

export interface IJob {
    customId: string;
    createdAt: Date;
    executeAt: Date;
    completedAt?: Date;
    type: JobType;
}

export const jobMongoSchema = {
    customId: { type: String, unique: true },
};

export interface IJobDocument extends IJob, Document {}
