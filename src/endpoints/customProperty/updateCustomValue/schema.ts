import { getComplexTypeArrayInputGraphQLSchema } from "../../utils";

const types = `
${getComplexTypeArrayInputGraphQLSchema(
    "UpdateCustomValueDataValueInput",
    "String"
)}

union UpdateCustomValueEndpointDataValue = UpdateCustomValueDataValueInput 
    | CustomPropertyValueValue

input UpdateCustomValueEndpointDataInput {
    value: UpdateCustomValueEndpointDataValue!
}
`;

const endpoint = `
updateCustomValue (
    customId: String!
    data: UpdateCustomValueEndpointDataInput!) : SingleCustomValueResponse
`;

export const updateCustomValueEndpointSchema = {
    types,
    endpoint,
};
