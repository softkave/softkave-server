const types = `
input CreateOptionEnpointDataInput {
    name: String!
    description: String
    color: String
    prevOptionId: String
}
`;

const endpoint = `
createOption (
    propertyId: String!, 
    data: CreateOptionEnpointDataInput!) : SingleCustomOptionResponse
`;

export const createOptionEndpointSchema = {
    types,
    endpoint,
};
