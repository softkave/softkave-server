import { Connection } from "mongoose";
import makeSingletonFn from "../../utilities/createSingletonFunc";
import { getDefaultConnection } from "../defaultConnection";
import MongoModel from "../MongoModel";
import entityAttrValueMongoSchema, {
    IEntityAttrValueDocument,
} from "./definitions";

export interface IEntityAttrValueModel
    extends MongoModel<IEntityAttrValueDocument> {}

const modelName = "entity-attr-value";
const collectionName = "entity-attr-values";

export const getEntityAttrValueModel = makeSingletonFn(
    (conn: Connection = getDefaultConnection().getConnection()) => {
        return new MongoModel<IEntityAttrValueDocument>({
            modelName,
            collectionName,
            rawSchema: entityAttrValueMongoSchema,
            connection: conn,
        });
    }
);
