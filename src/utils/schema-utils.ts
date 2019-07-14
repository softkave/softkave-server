const utilitySchema = `
  type Error {
    field: String
    message: String
  }

  type ErrorOnlyResponse {
    errors: [Error]
  }
`;

module.exports = {
  utilitySchema
};
export {};
