"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utilitySchema = `
  type Error {
    field: String
    message: String
  }

  type ErrorOnlyResponse {
    errors: [Error]
  }
`;
exports.utilitySchema = utilitySchema;
//# sourceMappingURL=schema-utils.js.map