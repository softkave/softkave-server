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

union CustomPropertyMeta = ITextCustomTypeMeta 
    | ISelectionCustomTypeMeta 
    | IDateCustomTypeMeta 
    | INumberCustomTypeMeta

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

type SelectionCustomTypeValue {
    value: [String]
}

type NumberCustomTypeValue {
    value: Float
}

union CustomPropertyInternalValue = ITextCustomTypeValue
    | IDateCustomTypeValue
    | ISelectionCustomTypeValue
    | INumberCustomTypeValue

type CustomPropertyValue {
    customId: String
    propertyId: String
    organizationId: String
    parent: ParentInformation
    type: String
    value: CustomPropertyInternalValue
    createdBy: String
    createdAt: String
    updatedBy: String
    updatedAt: String
}

input UpdateBoardInput {
    name: String
    description: String
    color: String
    boardStatuses: UpdateBlockStatusInput
    boardLabels: UpdateBlockLabelInput
    boardResolutions: UpdateBlockBoardStatusResolutionInput
}

type SingleOptionResponse {
    errors: [Error]
    values: [CustomSelectionOption]
}

type SinglePropertyResponse {
    errors: [Error]
    values: [CustomProperty]
}

type SingleValueResponse {
    errors: [Error]
    values: [CustomPropertyValue]
}

type MultiplePropertiesResponse {
    errors: [Error]
    properties: [CustomProperty]
}

type MultipleValuesResponse {
    errors: [Error]
    values: [CustomPropertyValue]
}

type MultipleOptionsResponse {
    errors: [Error]
    values: [CustomSelectionOption]
}

type CustomQuery {
    getProperties (parentId: String!) : MultiplePropertiesResponse
    getValues (parents: [ParentInformationInput!]!) : MultipleValuesResponse
}

type CustomMutation {
    changeOptionPosition () : SingleOptionResponse
    createOption () : SingleOptionResponse
    createProperty () : SinglePropertyResponse
    deleteProperty () : ErrorOnlyResponse
    updateManyOptions () : MultipleOptionsResponse
    updateOption () : SingleOptionResponse
    updateProperty () : SinglePropertyResponse
    updateValue () : SingleValueResponse
}
`;

export default customPropertySchema;
