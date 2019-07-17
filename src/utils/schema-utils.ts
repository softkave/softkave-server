const utilitySchema = `
  type Error {
    field: String
    message: String
  }

  type ErrorOnlyResponse {
    errors: [Error]
  }
`;

export { utilitySchema };
