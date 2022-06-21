import { buildSchema } from "graphql";
import clientSchema from "./clients/schema";
import EndpointsGraphQLController from "./EndpointsGraphQLController";
import pushSubscriptionSchema from "./pushSubscription/schema";
import endpointSchema from "./schema";
import sprintSchema from "./sprints/schema";
import systemSchema from "./system/schema";
import userSchema from "./user/schema";
import { utilsSchema } from "./utilsSchema";

export const rootSchema = `
    ${utilsSchema}
    ${userSchema}
    ${clientSchema}
    ${sprintSchema}
    ${systemSchema}
    ${pushSubscriptionSchema}
    ${endpointSchema}
`;

const compiledSchema = buildSchema(rootSchema);

export { compiledSchema as indexSchema, EndpointsGraphQLController };
