import { Document } from "mongoose";
import { getDate } from "../../utilities/fns";

export interface IRoomMemberWithReadCounter {
    userId: string;
    readCounter: Date;
}

const memberWithReadCounterSchema = {
    userId: { type: String },
    readCounter: { type: Date },
};

export interface IRoom {
    customId: string;
    name: string;
    orgId: string;
    createdAt: Date;
    createdBy: string;
    members: IRoomMemberWithReadCounter[];
    updatedAt?: Date;
    updatedBy?: string;
}

const roomSchema = {
    customId: {
        type: String,
        unique: true,
    },
    name: {
        type: String,
        unique: true,
    },
    orgId: { type: String },
    createdAt: { type: Date, default: getDate },
    createdBy: { type: String },
    members: { type: [memberWithReadCounterSchema], index: true },
    updatedAt: { type: Date },
    updatedBy: { type: String },
};

export default roomSchema;
export interface IRoomDocument extends IRoom, Document {}
