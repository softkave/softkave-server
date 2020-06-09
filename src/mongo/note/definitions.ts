import { Document } from "mongoose";
import { getDate } from "../../utilities/fns";

export const noteSchemaVersion = 1; // increment when you make changes that are not backward compatible

export interface INote {
  customId: string;
  blockId: string;
  body: string;
  createdAt: Date;
  createdBy: string;
  color: string;
  name: string;
  updatedAt?: Date;
  updatedBy?: string;
  isDeleted?: boolean;
  deletedAt?: Date;
  deletedBy?: string;
}

const notesSchema = {
  customId: { type: String, unique: true, index: true },
  blockId: { type: String },
  body: { type: String },
  createdAt: { type: Date, default: getDate },
  createdBy: { type: String },
  color: { type: String },
  name: { type: String },
  updatedAt: { type: Date },
  updatedBy: { type: String },
  isDeleted: { type: Boolean, default: false, index: true },
  deletedAt: { type: Date },
  deletedBy: { type: String },
};

export default notesSchema;
export interface INoteDocument extends INote, Document {}
