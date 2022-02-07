import Delta from "quill-delta";
import { SchemaTypes, Document } from "mongoose";
import { getDate } from "../../utilities/fns";
import { IParentInformation, parentSchema } from "../definitions";

export interface IDeltaNoteItem {
    customId: string;
    createdAt: string;
    createdBy: string;
    op: typeof Delta.Op;
    parents: IParentInformation[];
}

export const deltaNoteItemSchema = {
    customId: { type: String, unique: true, index: true },
    createdBy: { type: String },
    createdAt: { type: Date, default: getDate },
    op: SchemaTypes.Mixed,
    parents: { type: [parentSchema] },
};

export interface IDeltaNoteItemDocument extends Document, IDeltaNoteItem {}
