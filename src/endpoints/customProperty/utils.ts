import {
    ICustomProperty,
    ICustomPropertyValue,
    ICustomSelectionOption,
} from "../../mongo/custom-property/definitions";
import cast, { getDateString } from "../../utilities/fns";
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
    meta: (item) => item,
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
    value: (item) => item,
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

function getPublicCustomProperty(
    customProperty: ICustomProperty
): IPublicCustomProperty {
    return extractFields(customProperty, publicCustomPropertyFields);
}

function getPublicCustomPropertyArray(
    customProperties: ICustomProperty[]
): IPublicCustomProperty[] {
    return customProperties.map((customProperty) =>
        extractFields(customProperty, publicCustomPropertyFields)
    );
}

function getPublicCustomPropertyValue(
    value: ICustomPropertyValue
): IPublicCustomPropertyValue {
    return extractFields(value, publicCustomPropertyValueFields);
}

function getPublicCustomPropertyValuesArray(
    values: ICustomPropertyValue[]
): IPublicCustomPropertyValue[] {
    return values.map((value) =>
        extractFields(value, publicCustomPropertyValueFields)
    );
}

function getPublicCustomSelectionOption(
    value: ICustomSelectionOption
): IPublicCustomSelectionOption {
    return extractFields(value, publicCustomSelectionOptionFields);
}

function getPublicCustomSelectionOptionsArray(
    values: ICustomSelectionOption[]
): IPublicCustomSelectionOption[] {
    return values.map((value) =>
        extractFields(value, publicCustomSelectionOptionFields)
    );
}

export default class ToPublicCustomData {
    static customOption = getPublicCustomSelectionOption;
    static customOptionList = getPublicCustomSelectionOptionsArray;
    static customProperty = getPublicCustomProperty;
    static customPropertyList = getPublicCustomPropertyArray;
    static customValue = getPublicCustomPropertyValue;
    static customValueList = getPublicCustomPropertyValuesArray;
}

export function throwCustomPropertyNotFoundError() {
    throw new CustomPropertyDoesNotExistError();
}

export function throwCustomValueNotFoundError() {
    throw new CustomPropertyValueDoesNotExistError();
}

export function throwCustomOptionNotFoundError() {
    throw new CustomSelectionOptionDoesNotExistError();
}
