const utilsSchema = `
type Error {
    field: String
    message: String
    type: String
    action: String
    name: String
}

type ErrorOnlyResponse {
    errors: [Error]
}

type ParentInformation {
    type: String
    customId: String
}

input ParentInformationInput {
    type: String!
    customId: String!
}
`;

export { utilsSchema };
