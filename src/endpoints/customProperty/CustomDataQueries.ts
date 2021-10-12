import {
    CustomPropertyType,
    CustomValueAttrs,
    ICustomProperty,
    ICustomPropertyValue,
    ICustomSelectionOption,
} from "../../mongo/custom-property/definitions";
import { IParentInformation } from "../../mongo/definitions";
import { IEntityAttrValue } from "../../mongo/eav";
import {
    DataProviderFilterValueOperator,
    IDataProviderFilter,
} from "../contexts/DataProvider";

function byPropertyId(
    propertyId: string
): IDataProviderFilter<ICustomPropertyValue> {
    return {
        items: [
            {
                propertyId: {
                    value: propertyId,
                    queryOp: DataProviderFilterValueOperator.Equal,
                },
            },
        ],
    };
}

function byParents(
    parents: IParentInformation[]
): IDataProviderFilter<ICustomPropertyValue> {
    return {
        items: parents.map((parent) => ({
            parent: {
                value: parent,
                queryOp: DataProviderFilterValueOperator.Object,
            },
        })),
    };
}

function bySelectionEntityAndAttr(
    valueId: string
): IDataProviderFilter<IEntityAttrValue> {
    return {
        items: [
            {
                entityId: {
                    value: valueId,
                    queryOp: DataProviderFilterValueOperator.Equal,
                },
                attribute: {
                    value: CustomValueAttrs.SelectionValue,
                    queryOp: DataProviderFilterValueOperator.Equal,
                },
            },
        ],
    };
}

function bySelectionValue(
    value: string
): IDataProviderFilter<IEntityAttrValue> {
    return {
        items: [
            {
                attribute: {
                    value: CustomValueAttrs.SelectionValue,
                    queryOp: DataProviderFilterValueOperator.Equal,
                },
                value: {
                    value,
                    queryOp: DataProviderFilterValueOperator.Equal,
                },
            },
        ],
    };
}

function bySelectionEntityAttrAndValue(
    valueId: string,
    value: string
): IDataProviderFilter<IEntityAttrValue> {
    return {
        items: [
            {
                entityId: {
                    value: valueId,
                    queryOp: DataProviderFilterValueOperator.Equal,
                },
                attribute: {
                    value: CustomValueAttrs.SelectionValue,
                    queryOp: DataProviderFilterValueOperator.Equal,
                },
                value: {
                    value,
                    queryOp: DataProviderFilterValueOperator.Equal,
                },
            },
        ],
    };
}

function byParentAndPropertyId(
    parent: IParentInformation,
    propertyId: string
): IDataProviderFilter<ICustomSelectionOption> {
    return {
        items: [
            {
                parent: {
                    value: parent,
                    queryOp: DataProviderFilterValueOperator.Object,
                },
                propertyId: {
                    value: propertyId,
                    queryOp: DataProviderFilterValueOperator.Equal,
                },
            },
        ],
    };
}

function byParentId(parentId: string): IDataProviderFilter<ICustomProperty> {
    return {
        items: [
            {
                parent: {
                    value: { customId: parentId },
                    queryOp: DataProviderFilterValueOperator.Object,
                },
            },
        ],
    };
}

function byPropertyIdAndTypeAndParent(
    propertyId: string,
    type: CustomPropertyType,
    parent: IParentInformation
): IDataProviderFilter<ICustomProperty> {
    return {
        items: [
            {
                customId: {
                    value: propertyId,
                    queryOp: DataProviderFilterValueOperator.Equal,
                },
                type: {
                    value: type,
                    queryOp: DataProviderFilterValueOperator.Equal,
                },
                parent: {
                    value: parent,
                    queryOp: DataProviderFilterValueOperator.Object,
                },
            },
        ],
    };
}

export default class CustomDataQueries {
    public static byPropertyId = byPropertyId;
    public static byParents = byParents;
    public static byParentId = byParentId;
    public static byParentAndPropertyId = byParentAndPropertyId;
    public static bySelectionEntityAndAttr = bySelectionEntityAndAttr;
    public static byPropertyIdAndTypeAndParent = byPropertyIdAndTypeAndParent;
    public static bySelectionEntityAttrAndValue = bySelectionEntityAttrAndValue;
    public static bySelectionValue = bySelectionValue;
}
