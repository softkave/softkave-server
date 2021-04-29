import { SchemaTypes } from "mongoose";
import { SystemResourceType, TextResourceTypes } from "../models/system";
import { getDate } from "../utilities/fns";
import { ensureTypeFields } from "./utils";

export enum CustomPropertyType {
    Text = "Text",
    Date = "Date",
    Selection = "Selection",
    Number = "Number",
}

export interface TextCustomTypeMeta {
    minChars?: number;
    maxChars?: number;
    type: TextResourceTypes;
}

export interface DateCustomTypeMeta {
    isRange?: boolean;
    startDate?: string;
    endDate?: string;
}

export interface SelectionCustomTypeMeta {
    resourceType?: SystemResourceType;
    multiple?: boolean;
    min?: number;
    max?: number;
}

interface IParentId {
    parentType: SystemResourceType;
    parentId: string;
}

export interface ISelectionCustomTypeOptions {
    persistentId: string;
    name: string;
    lowercasedName: string;
    description?: string;
    lowercasedDescription?: string;
    parentIds: IParentId[];
    propertyId: string;
}

export interface NumberCustomTypeMeta {
    type: "integer" | "floating-point" | "any";
    min?: number;
    max?: number;
}

export interface ICustomProperty {
    persistentId: string;
    name: string;
    lowercasedName: string;
    description: string;
    lowercasedDescription: string;
    parentIds: IParentId[];
    type: CustomPropertyType;
    required?: string;
    meta: any;
    createdAt: string;
    createdBy: string;
    lastUpdatedAt?: string;
    lastUpdatedBy?: string;
}

export interface TextCustomTypeValue {
    value: string;
}

export interface DateCustomTypeValue {
    // if isRange is true, value will have length 2, otherwise, 1
    value: string[];
}

export interface SelectionCustomTypeValue {
    value: string[];
}

export interface NumberCustomTypeValue {
    value: number;
}

export interface ICustomPropertyValue {
    persistentId: string;
    propertyId: string;
    parentIds: IParentId[];
    type: CustomPropertyType;
    value: any;
}

// const customPropertySchema = ensureTypeFields<ICustomProperty>({
//     persistentId: { type: String, unique: true, index: true },
//     createdBy: { type: String },
//     createdAt: { type: Date, default: getDate },
//     name: { type: String },
//     lowercasedName: { type: String },
//     description: { type: String },
//     lowercasedDescription: { type: String },
//     parentIds: {
//         type: [{ parentType: { type: String }, parentId: { type: String } }],
//     },
//     type: { type: String },
//     required: { type: Boolean },
//     meta: { type: SchemaTypes.Mixed },
//     lastUpdatedAt: { type: Date },
//     lastUpdatedBy: { type: String },
// });

// export interface IOrganizationDocument extends Document, IOrganization {}

// const schema = new Schema<IOrganizationDocument>(customPropertySchema);
// const modelName = "organization";
// const collectionName = "organizations";

// export function getOrganizationModel(
//     connection: Connection
// ): Model<IOrganizationDocument> {
//     const model = connection.model<IOrganizationDocument>(
//         modelName,
//         schema,
//         collectionName
//     );

//     return model;
// }

// export type IOrganizationModel = Model<IOrganizationDocument>;

// const organizationSchema = ensureTypeFields<IOrganization>({
//     persistentId: { type: String, unique: true, index: true },
//     createdBy: { type: String },
//     createdAt: { type: Date, default: getDate },
//     name: { type: String },
//     lowerCasedName: { type: String },
//     description: { type: String },
//     updatedAt: { type: Date },
//     updatedBy: { type: String },
//     isDeleted: { type: Boolean },
//     deletedAt: { type: Date },
//     deletedBy: { type: String },
//     color: { type: String },
//     publicPermissionGroupId: { type: String },
// });

// export interface IOrganizationDocument extends Document, IOrganization {}

// const schema = new Schema<IOrganizationDocument>(organizationSchema);
// const modelName = "organization";
// const collectionName = "organizations";

// export function getOrganizationModel(
//     connection: Connection
// ): Model<IOrganizationDocument> {
//     const model = connection.model<IOrganizationDocument>(
//         modelName,
//         schema,
//         collectionName
//     );

//     return model;
// }

// export type IOrganizationModel = Model<IOrganizationDocument>;

// const organizationSchema = ensureTypeFields<IOrganization>({
//     persistentId: { type: String, unique: true, index: true },
//     createdBy: { type: String },
//     createdAt: { type: Date, default: getDate },
//     name: { type: String },
//     lowerCasedName: { type: String },
//     description: { type: String },
//     updatedAt: { type: Date },
//     updatedBy: { type: String },
//     isDeleted: { type: Boolean },
//     deletedAt: { type: Date },
//     deletedBy: { type: String },
//     color: { type: String },
//     publicPermissionGroupId: { type: String },
// });

// export interface IOrganizationDocument extends Document, IOrganization {}

// const schema = new Schema<IOrganizationDocument>(organizationSchema);
// const modelName = "organization";
// const collectionName = "organizations";

// export function getOrganizationModel(
//     connection: Connection
// ): Model<IOrganizationDocument> {
//     const model = connection.model<IOrganizationDocument>(
//         modelName,
//         schema,
//         collectionName
//     );

//     return model;
// }

// export type IOrganizationModel = Model<IOrganizationDocument>;
