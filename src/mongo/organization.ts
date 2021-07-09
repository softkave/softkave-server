import { Connection, Model, Schema, Document } from "mongoose";
import { getDate } from "../utilities/fns";
import { ensureTypeFields } from "./utils";

export interface IOrganization1 {
    persistentId: string;
    createdBy: string;
    createdAt: Date;
    name: string;
    lowerCasedName: string;
    description?: string;
    updatedAt?: Date;
    updatedBy?: string;
    isDeleted?: boolean;
    deletedAt?: Date;
    deletedBy?: string;
    color: string;
    publicPermissionGroupId: string;
}

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
