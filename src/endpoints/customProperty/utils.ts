import {
    ICustomProperty,
    ICustomPropertyValue,
} from "../../mongo/custom-property/definitions";
import { getDateString } from "../../utilities/fns";
import { extractFields, getFields } from "../utils";
import { IPublicCustomProperty, IPublicCustomPropertyValue } from "./types";

const publicCustomPropertyFields = getFields<IPublicCustomProperty>({
    customId: true,
    name: true,
    description: true,
    parents: {
        type: true,
        customId: true,
    },
    type: true,
    isRequired: true,
    meta: true,
    createdBy: true,
    createdAt: getDateString,
    updatedBy: true,
    updatedAt: getDateString,
});

const publicCustomPropertyValueFields = getFields<IPublicCustomPropertyValue>({
    customId: true,
    propertyId: true,
    parents: {
        type: true,
        customId: true,
    },
    type: true,
    value: true,
    createdBy: true,
    createdAt: getDateString,
    updatedBy: true,
    updatedAt: getDateString,
});

export function getPublicCustomProperty(
    customProperty: ICustomProperty
): IPublicCustomProperty {
    return extractFields(customProperty, publicCustomPropertyFields);
}

export function getPublicCustomPropertyArray(
    customProperties: ICustomProperty[]
): IPublicCustomProperty[] {
    return customProperties.map((customProperty) =>
        extractFields(customProperty, publicCustomPropertyFields)
    );
}

export function getPublicCustomPropertyValueData(
    value: ICustomPropertyValue
): IPublicCustomPropertyValue {
    return extractFields(value, publicCustomPropertyValueFields);
}

export function getPublicCustomPropertyValuesArray(
    values: ICustomPropertyValue[]
): IPublicCustomPropertyValue[] {
    return values.map((value) =>
        extractFields(value, publicCustomPropertyValueFields)
    );
}
