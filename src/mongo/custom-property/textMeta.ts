import { Connection, Document } from "mongoose";
import makeSingletonFn from "../../utilities/createSingletonFunc";
import { getDefaultConnection } from "../defaultConnection";
import MongoModel from "../MongoModel";

export enum TextResourceTypes {
    Text = "text",
}

export interface ITextCustomTypeMeta {
    customId: string;
    propertyId: string;
    minChars?: number;
    maxChars?: number;
    defaultText?: string;
    type: TextResourceTypes;
    createdBy: string;
    createdAt: Date;
    updatedBy?: string;
    updatedAt?: Date;
}

const textMetaSchema = {
    customId: { type: String, unique: true, index: true },
    propertyId: { type: String },
    createdBy: { type: String },
    createdAt: { type: Date },
    updatedBy: { type: String },
    updatedAt: { type: Date },
    minChars: { type: Number },
    maxChars: { type: Number },
    defaultText: { type: String },
    type: { type: String },
};

export interface ITextCustomTypeMetaDocument
    extends Document<ITextCustomTypeMeta> {}

export interface ITextCustomTypeMetaModel
    extends MongoModel<ITextCustomTypeMetaDocument> {}

const textMetaModelName = "custom-property-text-meta";
const textMetaCollectionName = "custom-property-text-metas";

export const getCustomPropertyTextMetaModel = makeSingletonFn(
    (conn: Connection = getDefaultConnection().getConnection()) => {
        return new MongoModel<ITextCustomTypeMetaDocument>({
            modelName: textMetaModelName,
            collectionName: textMetaCollectionName,
            rawSchema: textMetaSchema,
            connection: conn,
        });
    }
);
