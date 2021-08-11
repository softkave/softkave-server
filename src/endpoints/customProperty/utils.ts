import {
    ICustomProperty,
    ICustomPropertyValue,
    ICustomSelectionOption,
} from "../../mongo/custom-property/definitions";
import { getDateString } from "../../utilities/fns";
import { extractFields, getFields } from "../utils";
import {
    CustomPropertyDoesNotExistError,
    CustomPropertyValueDoesNotExistError,
    CustomSelectionOptionDoesNotExistError,
} from "./errors";
import {
    IPublicCustomProperty,
    IPublicCustomPropertyValue,
    IPublicCustomSelectionOption,
} from "./types";

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

const publicCustomSelectionOptionFields =
    getFields<IPublicCustomSelectionOption>({
        customId: true,
        propertyId: true,
        parents: {
            type: true,
            customId: true,
        },
        createdBy: true,
        createdAt: getDateString,
        updatedBy: true,
        updatedAt: getDateString,
        color: true,
        description: true,
        name: true,
        nextOptionId: true,
        prevOptionId: true,
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

export function getPublicCustomSelectionOption(
    value: ICustomSelectionOption
): IPublicCustomSelectionOption {
    return extractFields(value, publicCustomSelectionOptionFields);
}

export function getPublicCustomSelectionOptionsArray(
    values: ICustomSelectionOption[]
): IPublicCustomSelectionOption[] {
    return values.map((value) =>
        extractFields(value, publicCustomSelectionOptionFields)
    );
}

export function throwCustomPropertyNotFoundError() {
    throw new CustomPropertyDoesNotExistError();
}

export function throwCustomPropertyValueNotFoundError() {
    throw new CustomPropertyValueDoesNotExistError();
}

export function throwCustomSelectionOptionNotFoundError() {
    throw new CustomSelectionOptionDoesNotExistError();
}
