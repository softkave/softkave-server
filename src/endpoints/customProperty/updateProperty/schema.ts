const types = `
input UpdatePropertyEndpointDataInput {
    name: String
    description: String
    type: CustomPropertyType
    isRequired: Boolean
    meta: TextCustomTypeMeta
}
`;

const endpoint = `
updateProperty (
    customId: String!, 
    property: UpdatePropertyEndpointDataInput!) : SingleCustomPropertyResponse
`;

export const updatePropertyEndpointSchema = {
    types,
    endpoint,
};
