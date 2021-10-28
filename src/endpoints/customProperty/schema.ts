import { changeOptionPositionEndpointSchema } from "./changeOptionPosition/schema";
import { createOptionEndpointSchema } from "./createOption/schema";
import { createPropertyEndpointSchema } from "./createProperty/schema";
import { deleteOptionEndpointSchema } from "./deleteOption/schema";
import { deletePropertyEndpointSchema } from "./deleteProperty/schema";
import { getPropertiesEndpointSchema } from "./getProperties/schema";
import { getValuesEndpointSchema } from "./getValues/schema";
import { insertCustomValueEndpointSchema } from "./insertCustomValue/schema";
import { updateCustomValueEndpointSchema } from "./updateCustomValue/schema";
import { updateOptionEndpointSchema } from "./updateOption/schema";
import { updatePropertyEndpointSchema } from "./updateProperty/schema";

const customPropertySchema = `
type TextCustomTypeMeta {
    minChars: Float
    maxChars: Float
    defaultText: String
    type: String
}

type DateCustomTypeMeta {
    isRange: Boolean
    startDate: String
    endDate: String
    defaultStartDate: String
    defaultEndDate: String
}

type SelectionFrom {
    customId: String
    type: String
}

type CustomSelectionOption {
    customId: String
    name: String
    description: String
    organizationId: String
    parent: ParentInformation
    propertyId: String
    color: String
    createdBy: String
    createdAt: String
    updatedBy: String
    updatedAt: String
    prevOptionId: String
    nextOptionId: String
}

type CustomOptionsProps {
    areOptionsUnique: Boolean
    enforceOptionsLink: Boolean
}

type SelectionCustomTypeMeta {
    type: String
    isMultiple: Boolean
    min: Float
    max: Float
    selectFrom: SelectionFrom
    customOptionsProps: CustomOptionsProps
    defaultOptionId: String
}

type NumberTypeFormatting {
    decimalPlaces: Float
}

type NumberCustomTypeMeta {
    type: String
    min: Float
    max: Float
    format: NumberTypeFormatting
    defaultNumber: Float
}

union CustomPropertyMeta = TextCustomTypeMeta 
    | SelectionCustomTypeMeta 
    | DateCustomTypeMeta 
    | NumberCustomTypeMeta

type CustomProperty {
    customId: String
    name: String
    description: String
    organizationId: String
    parent: ParentInformation
    type: String
    isRequired: Boolean
    meta: CustomPropertyMeta
    createdBy: String
    createdAt: String
    updatedBy: String
    updatedAt: String
}

type TextCustomTypeValue {
    value: String
}

type DateCustomTypeValue {
    date: String
    endDate: String
}

type NumberCustomTypeValue {
    value: Float
}

union CustomPropertyValueValue = TextCustomTypeValue
    | DateCustomTypeValue
    | NumberCustomTypeValue

type CustomPropertyValue {
    customId: String
    propertyId: String
    organizationId: String
    parent: ParentInformation
    type: String
    value: CustomPropertyValueValue
    createdBy: String
    createdAt: String
    updatedBy: String
    updatedAt: String
}

type SingleCustomOptionResponse {
    errors: [Error]
    values: [CustomSelectionOption]
}

type SingleCustomPropertyResponse {
    errors: [Error]
    values: [CustomProperty]
}

type SingleCustomValueResponse {
    errors: [Error]
    values: [CustomPropertyValue]
}

type MultipleCustomPropertiesResponse {
    errors: [Error]
    properties: [CustomProperty]
}

type MultipleCustomValuesResponse {
    errors: [Error]
    values: [CustomPropertyValue]
}

type MultipleCustomOptionsResponse {
    errors: [Error]
    values: [CustomSelectionOption]
}

${createOptionEndpointSchema.types}
${createPropertyEndpointSchema.types}
${updateOptionEndpointSchema.types}
${updatePropertyEndpointSchema.types}
${insertCustomValueEndpointSchema.types}
${updateCustomValueEndpointSchema.types}

type CustomPropertiesQuery {
    ${getPropertiesEndpointSchema.endpoint}
    ${getValuesEndpointSchema.endpoint}
}

type CustomPropertiesMutation {
    ${changeOptionPositionEndpointSchema.endpoint}
    ${createOptionEndpointSchema.endpoint}
    ${createPropertyEndpointSchema.endpoint}
    ${deletePropertyEndpointSchema.endpoint}
    ${updateOptionEndpointSchema.endpoint}
    ${deleteOptionEndpointSchema.endpoint}
    ${updatePropertyEndpointSchema.endpoint}
    ${insertCustomValueEndpointSchema.endpoint}
    ${updateCustomValueEndpointSchema.endpoint}
}
`;

export default customPropertySchema;
