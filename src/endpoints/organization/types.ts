import { BlockType } from "../../mongo/block";
import { ConvertDatesToStrings } from "../../utilities/types";

export interface IOrganization {
    customId: string;
    createdBy: string;
    createdAt: Date;
    type: BlockType.Organization;
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

export interface INewOrganizationInput {
    name: string;
    description?: string;
    color: string;
}

export type IPublicOrganization = ConvertDatesToStrings<{
    customId: string;
    createdBy: string;
    createdAt: Date;
    type: BlockType.Organization;
    name?: string;
    description?: string;
    updatedAt?: Date;
    updatedBy?: string;
    color?: string;
}>;
