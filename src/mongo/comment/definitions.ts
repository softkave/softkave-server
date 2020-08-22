import { Document } from "mongoose";
import { getDate } from "../../utilities/fns";

export interface IComment {
  customId: string;
  taskId: string;
  comment: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  updatedBy: string;
  isDeleted?: boolean;
  deletedAt?: Date;
  deletedBy?: string;
}

const commentsSchema = {
  customId: { type: String, unique: true, index: true },
  taskId: { type: String },
  comment: { type: String },
  createdBy: { type: String },
  createdAt: { type: Date, default: getDate },
  updatedAt: { type: Date, default: getDate },
  updatedBy: { type: String },
  isDeleted: { type: Boolean, default: false, index: true },
  deletedAt: { type: Date },
  deletedBy: { type: String },
};

export default commentsSchema;
export interface ICommentDocument extends IComment, Document {}
