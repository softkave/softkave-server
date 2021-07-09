import { BlockType } from "../../mongo/block";
import { ConvertDatesToStrings } from "../../utilities/types";

export interface IOrganization {
    customId: string;
    createdBy: string;
    createdAt: Date;
    type: BlockType;
    name: string;
    lowerCasedName: string;
    description?: string;
    updatedAt?: Date;
    updatedBy?: string;
    isDeleted?: boolean;
    deletedAt?: Date;
    deletedBy?: string;
    permissionResourceId?: string;
    color: string;
    publicPermissionGroupId?: string;
}

export interface INewOrgInput {
    name: string;
    description?: string;
    color: string;
}

export type IPublicOrg = ConvertDatesToStrings<{
    customId: string;
    createdBy: string;
    createdAt: Date;
    type: BlockType;
    name?: string;
    description?: string;
    updatedAt?: Date;
    updatedBy?: string;
    color?: string;
}>;
