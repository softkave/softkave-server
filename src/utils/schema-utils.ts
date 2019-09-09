const utilitySchema = `
  type Error {
    field: String
    message: String
    type: String
    action: String
  }

  type ErrorOnlyResponse {
    errors: [Error]
  }
`;

export { utilitySchema };