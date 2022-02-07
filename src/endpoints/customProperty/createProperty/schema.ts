const types = `
input CreatePropertyEndpointDataInput {
    name: String!
    description: String
    type: CustomPropertyType!
    isRequired: Boolean
    meta: TextCustomTypeMeta!
}
`;

const endpoint = `
createOption (
    parent: IParentInformation!, 
    data: CreatePropertyEndpointDataInput!) : SingleCustomOptionResponse
`;

export const createPropertyEndpointSchema = {
    types,
    endpoint,
};
