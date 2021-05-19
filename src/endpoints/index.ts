import { buildSchema } from "graphql";
import blockSchema from "./block/schema";
import EndpointsGraphQLController from "./EndpointsGraphQLController";
import pushSubscriptionSchema from "./pushSubscription/schema";
import endpointSchema from "./schema";
import sprintSchema from "./sprints/schema";
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
    ${sprintSchema}
    ${systemSchema}
    ${pushSubscriptionSchema}
    ${endpointSchema}
`;

try {
    const compiledSchema = buildSchema(rootSchema);
} catch (error) {
    console.error(error);
}

const compiledSchema = buildSchema(rootSchema);

export { compiledSchema as indexSchema, EndpointsGraphQLController };
