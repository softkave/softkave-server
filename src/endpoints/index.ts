import { buildSchema } from "graphql";
import blockSchema from "./block/schema";
import EndpointController from "./controller";
import noteSchema from "./note/schema";
import endpointSchema from "./schema";
import sprintSchema from "./sprint/schema";
import systemSchema from "./system/schema";
import userSchema from "./user/schema";

const rootSchema = `
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

    ${userSchema}
    ${blockSchema}
    ${noteSchema}
    ${sprintSchema}
    ${systemSchema}
    ${endpointSchema}
`;

const compiledSchema = buildSchema(rootSchema);

export { compiledSchema as indexSchema, EndpointController };
