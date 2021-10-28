import { BlockType } from "../../../mongo/block";
import {
    CustomPropertyType,
    CustomValueAttrs,
    ICustomPropertyValue,
    INumberCustomTypeMeta,
    INumberCustomTypeValue,
    ISelectionCustomTypeMeta,
    ITextCustomTypeMeta,
    ITextCustomTypeValue,
    NumberTypes,
} from "../../../mongo/custom-property/definitions";
import { InvalidInputError } from "../../../utilities/errors";
import { getDate, pluralize, same } from "../../../utilities/fns";
import getNewId from "../../../utilities/getNewId";
import { validate } from "../../../utilities/joiUtils";
import { throwBoardNotFoundError } from "../../board/utils";
import { IBaseContext } from "../../contexts/BaseContext";
import canReadOrganization from "../../organization/canReadBlock";
import { throwOrganizationNotFoundError } from "../../organization/utils";
import CustomDataQueries from "../CustomDataQueries";
import ToPublicCustomData from "../utils";
import {
    IInsertCustomValueEndpointParamsFields,
    InsertCustomValueEndpoint,
} from "./types";
import { updateValueEndpointJoiSchema } from "./validation";

function isSelection(type: CustomPropertyType, value: any): value is string[] {
    return type === CustomPropertyType.Selection;
}

function checkCustomTextValue(
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
            field: same<IInsertCustomValueEndpointParamsFields>(
                "data.value.value"
            ),
        });
    }

    // TODO: should we truncate on max exceeded?
    if (meta.maxChars && meta.maxChars > value.value.length) {
        throw new InvalidInputError({
            message: `Value should be at most ${meta.maxChars} characters`,
            field: same<IInsertCustomValueEndpointParamsFields>(
                "data.value.value"
            ),
        });
    }

    return value;
}

function formatNumberValue(meta: INumberCustomTypeMeta, value: number) {
    return meta.type === NumberTypes.Decimal && meta.decimalPlaces
        ? value.toFixed(meta.decimalPlaces)
        : String(value);
}

function checkCustomNumberValue(
    meta: INumberCustomTypeMeta,
    value: INumberCustomTypeValue
): INumberCustomTypeValue {
    if (!value.value) {
        return { value: meta.defaultNumber || 0 };
    }

    if (meta.min && meta.min > value.value) {
        throw new InvalidInputError({
            message: `Value should be greater than ${formatNumberValue(
                meta,
                meta.min
            )}`,
            field: same<IInsertCustomValueEndpointParamsFields>(
                "data.value.value"
            ),
        });
    }

    if (meta.max && meta.max > value.value) {
        throw new InvalidInputError({
            message: `Value should be less than ${formatNumberValue(
                meta,
                meta.max
            )}`,
            field: same<IInsertCustomValueEndpointParamsFields>(
                "data.value.value"
            ),
        });
    }

    if (meta.type === NumberTypes.Interger && !Number.isInteger(value.value)) {
        throw new InvalidInputError({
            message: `Value should be an integer`,
            field: same<IInsertCustomValueEndpointParamsFields>(
                "data.value.value"
            ),
        });
    }

    return value;
}

async function checkCustomSelectionValue(
    context: IBaseContext,
    meta: ISelectionCustomTypeMeta,
    value: string[]
): Promise<string[]> {
    if (!value.length) {
        // TODO: validate that default options meet max and min constraints
        // TODO: do the same for other types
        return meta.defaultOptions || [];
    }

    if (!meta.isMultiple && value.length > 1) {
        throw new InvalidInputError({
            message: `Maximum of 1 item can be selected`,
            field: same<IInsertCustomValueEndpointParamsFields>(
                "data.value.value"
            ),
        });
    }

    if (meta.min && meta.min > value.length) {
        throw new InvalidInputError({
            message: `Minimum of ${meta.min} ${pluralize(
                "item",
                meta.min
            )} should be selected`,
        });
    }

    if (meta.max && meta.max > value.length) {
        throw new InvalidInputError({
            message: `Maximum of ${meta.max} ${pluralize(
                "item",
                meta.max
            )} should be selected`,
        });
    }

    if (meta.selectFrom) {
        const block = await context.block.assertGetBlockById(
            context,
            meta.selectFrom.customId,
            () =>
                meta.selectFrom.type === BlockType.Organization
                    ? throwOrganizationNotFoundError
                    : meta.selectFrom.type === BlockType.Board
                    ? throwBoardNotFoundError
                    : undefined
        );
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
