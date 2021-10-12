const types = `
union InsertCustomValueEndpointDataValue = [String!] | CustomPropertyValueValue

input InsertCustomValueEndpointDataInput {
    value: InsertCustomValueEndpointDataValue!
}
`;

const endpoint = `
insertCustomValue (
    propertyId: String!,
    parent: ParentInformation!,
    type: CustomPropertyType!,
    data: InsertCustomValueEndpointDataInput!) : SingleCustomValueResponse
`;

export const insertCustomValueEndpointSchema = {
    types,
    endpoint,
};
