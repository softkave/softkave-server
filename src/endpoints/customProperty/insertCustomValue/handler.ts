import {
    CustomPropertyType,
    CustomValueAttrs,
    ICustomProperty,
    ICustomPropertyValue,
    INumberCustomTypeMeta,
    INumberCustomTypeValue,
    ITextCustomTypeMeta,
    ITextCustomTypeValue,
} from "../../../mongo/custom-property/definitions";
import { InvalidInputError } from "../../../utilities/errors";
import { getDate } from "../../../utilities/fns";
import getNewId from "../../../utilities/getNewId";
import { validate } from "../../../utilities/joiUtils";
import canReadOrganization from "../../organization/canReadBlock";
import CustomDataQueries from "../CustomDataQueries";
import ToPublicCustomData from "../utils";
import { InsertCustomValueEndpoint } from "./types";
import { updateValueEndpointJoiSchema } from "./validation";

function isSelection(type: CustomPropertyType, value: any): value is string[] {
    return type === CustomPropertyType.Selection;
}

function checkCustomStringValue(
    meta: ITextCustomTypeMeta,
    value: ITextCustomTypeValue
): ITextCustomTypeValue {
    if (!value.value) {
        return { value: meta.defaultText || "" };
    }

    // TODO: should we pad in not reaching min?
    if (meta.minChars && meta.minChars > value.value.length) {
        throw new InvalidInputError({
            message: `Value should be at least ${meta.minChars} characters`,
        });
    }

    // TODO: should we truncate on max exceeded?
    if (meta.maxChars && meta.maxChars > value.value.length) {
        throw new InvalidInputError({
            message: `Value should be at most ${meta.maxChars} characters`,
        });
    }

    return value;
}

function checkCustomNumberValue(
    meta: INumberCustomTypeMeta,
    value: INumberCustomTypeValue
): INumberCustomTypeValue {
    if (!value.value) {
        return { value: meta.defaultText || "" };
    }

    if (meta.minChars && meta.minChars > value.value.length) {
        throw new InvalidInputError({
            message: `Value should be at least ${meta.minChars}`,
        });
    }

    if (meta.maxChars && meta.maxChars > value.value.length) {
        throw new InvalidInputError({
            message: `Value should be at most ${meta.maxChars}`,
        });
    }

    return value;
}

const insertCustomValue: InsertCustomValueEndpoint = async (
    context,
    instData
) => {
    const data = validate(instData.data, updateValueEndpointJoiSchema);
    const user = await context.session.getUser(context, instData);
    const property = await context.data.customProperty.assertGetItem(
        CustomDataQueries.byPropertyIdAndTypeAndParent(
            data.propertyId,
            data.type,
            data.parent
        )
    );

    canReadOrganization(property.organizationId, user);

    // TODO: validate property and type constraints

    const savedValue = await context.data.customValue.saveItem({
        value: isSelection(data.type, data.data)
            ? null
            : (data.data.value as ICustomPropertyValue["value"]),
        createdAt: getDate(),
        createdBy: user.customId,
        customId: getNewId(),
        organizationId: property.organizationId,
        parent: data.parent,
        propertyId: property.customId,
        type: property.type,
    });

    if (isSelection(data.type, data.data.value) && data.data.value.length > 0) {
        // TODO: validate that the options exist
        await context.data.entityAttrValue.bulkSaveItems(
            data.data.value.map((item) => ({
                attribute: CustomValueAttrs.SelectionValue,
                createdAt: getDate(),
                createdBy: user.customId,
                customId: getNewId(),
                entityId: savedValue.customId,
                value: item,
            }))
        );
    }

    return {
        value: ToPublicCustomData.customValue(savedValue),
    };
};

export default insertCustomValue;
