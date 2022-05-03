import { Document } from "mongoose";
import { getDate } from "../../utilities/fns";

export interface IRoomMemberReadCounter {
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
  members: IRoomMemberReadCounter[];
  updatedAt?: Date;
  updatedBy?: string;
  lastChatCreatedAt?: Date | string;
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
  lastChatCreatedAt: { type: Date },
};

export default roomSchema;
export interface IRoomDocument extends IRoom, Document {}
