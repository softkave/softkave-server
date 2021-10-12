const types = `
input UpdateOptionEndpointDataInput {
    name: String
    description: String
    color: String
}
`;

const endpoint = `
updateOption (
    customId: String!, 
    data: UpdateOptionEndpointDataInput!) : SingleCustomOptionResponse
`;

export const updateOptionEndpointSchema = {
    types,
    endpoint,
};
