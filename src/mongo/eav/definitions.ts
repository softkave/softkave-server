import { Document } from "mongoose";
import { getDate } from "../../utilities/fns";

export interface IEntityAttrValue {
    customId: string;
    entityId: string;
    attribute: string;
    value: string;
    createdAt: Date;
    createdBy: string;
    updatedAt?: Date;
    updatedBy?: string;
}

const entityAttrValueMongoSchema = {
    customId: { type: String, unique: true, index: true },
    entityId: { type: String, unique: true, index: true },
    attribute: { type: String },
    value: { type: String },
    createdAt: { type: Date, default: getDate },
    createdBy: { type: String },
    updatedAt: { type: Date, default: getDate },
    updatedBy: { type: String },
};

export default entityAttrValueMongoSchema;
export type IEntityAttrValueDocument = Document<IEntityAttrValue>;
