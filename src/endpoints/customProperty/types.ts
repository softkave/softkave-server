import { CustomPropertyType } from "../../mongo/custom-property/definitions";
import { IParentInformation } from "../../mongo/definitions";
import { ConvertDatesToStrings } from "../../utilities/types";

export type IPublicCustomProperty = ConvertDatesToStrings<{
    customId: string;
    name: string;
    description: string;
    parents: IParentInformation[];
    type: CustomPropertyType;
    isRequired?: string;
    meta: any;
    createdBy: string;
    createdAt: Date;
    updatedBy?: string;
    updatedAt?: Date;
}>;

export type IPublicCustomPropertyValue = ConvertDatesToStrings<{
    customId: string;
    propertyId: string;
    parents: IParentInformation[];
    type: CustomPropertyType;
    value: any;
    createdBy: string;
    createdAt: Date;
    updatedBy?: string;
    updatedAt?: Date;
}>;
