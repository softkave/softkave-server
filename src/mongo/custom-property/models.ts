import { Connection } from "mongoose";
import makeSingletonFn from "../../utilities/createSingletonFunc";
import { getDefaultConnection } from "../defaultConnection";
import MongoModel from "../MongoModel";
import {
    customPropertySchema,
    customPropertyValueSchema,
    ICustomPropertyDocument,
    ICustomPropertyValueDocument,
    ICustomSelectionOptionDocument,
    customSelectionOptionSchema,
} from "./definitions";

const customSelectionOptionModelName = "custom-selection-option";
const customSelectionOptionCollectionName = "custom-selection-options";

export const getCustomSelectionOptionModel = makeSingletonFn(
    (conn: Connection = getDefaultConnection().getConnection()) => {
        return new MongoModel<ICustomSelectionOptionDocument>({
            modelName: customSelectionOptionModelName,
            collectionName: customSelectionOptionCollectionName,
            rawSchema: customSelectionOptionSchema,
            connection: conn,
        });
    }
);

export interface ICustomSelectionOptionModel
    extends MongoModel<ICustomSelectionOptionDocument> {}

const customPropertyModelName = "custom-property";
const customPropertyCollectionName = "custom-properties";

export const getCustomPropertyModel = makeSingletonFn(
    (conn: Connection = getDefaultConnection().getConnection()) => {
        return new MongoModel<ICustomPropertyDocument>({
            modelName: customPropertyModelName,
            collectionName: customPropertyCollectionName,
            rawSchema: customPropertySchema,
            connection: conn,
        });
    }
);

export interface ICustomPropertyModel
    extends MongoModel<ICustomPropertyDocument> {}

const customPropertyValueModelName = "custom-property-value";
const customPropertyValueCollectionName = "custom-property-values";

export const getCustomPropertyValueModel = makeSingletonFn(
    (conn: Connection = getDefaultConnection().getConnection()) => {
        return new MongoModel<ICustomPropertyValueDocument>({
            modelName: customPropertyValueModelName,
            collectionName: customPropertyValueCollectionName,
            rawSchema: customPropertyValueSchema,
            connection: conn,
        });
    }
);

export interface ICustomPropertyValueModel
    extends MongoModel<ICustomPropertyValueDocument> {}