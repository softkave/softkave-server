import {
    CustomPropertyType,
    IDateCustomTypeMeta,
    IDateCustomTypeValue,
    INumberCustomTypeMeta,
    INumberCustomTypeValue,
    ISelectionCustomTypeMeta,
    ISelectionCustomTypeValue,
    ITextCustomTypeMeta,
    ITextCustomTypeValue,
} from "../../mongo/custom-property/definitions";
import { IParentInformation } from "../../mongo/definitions";
import { ConvertDatesToStrings } from "../../utilities/types";

export type IPublicCustomProperty = ConvertDatesToStrings<{
    customId: string;
    name: string;
    description?: string;
    parents: IParentInformation[];
    type: CustomPropertyType;
    isRequired?: boolean;
    meta:
        | ITextCustomTypeMeta
        | ISelectionCustomTypeMeta
        | IDateCustomTypeMeta
        | INumberCustomTypeMeta;
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
    value:
        | ITextCustomTypeValue
        | IDateCustomTypeValue
        | ISelectionCustomTypeValue
        | INumberCustomTypeValue;
    createdBy: string;
    createdAt: Date;
    updatedBy?: string;
    updatedAt?: Date;
}>;

export type IPublicCustomSelectionOption = ConvertDatesToStrings<{
    customId: string;
    name: string;
    description?: string;
    parents: IParentInformation[];
    propertyId: string;
    color?: string;
    createdBy: string;
    createdAt: Date;
    updatedBy?: string;
    updatedAt?: Date;
    prevOptionId?: string;
    nextOptionId?: string;
}>;
