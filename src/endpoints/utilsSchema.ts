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
`;

export { utilsSchema };
