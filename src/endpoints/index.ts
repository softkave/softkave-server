import { buildSchema } from "graphql";
import collaborationRequestSchema from "../mongo/collaboration-request/definitions";
import boardSchema from "./board/schema";
import clientSchema from "./client/schema";
import collaboratorsSchema from "./collaborator/schema";
import EndpointsGraphQLController from "./EndpointsGraphQLController";
import organizationSchema from "./organization/schema";
import endpointSchema from "./schema";
import sprintSchema from "./sprints/schema";
import systemSchema from "./system/schema";
import taskSchema from "./task/schema";
import userSchema from "./user/schema";
import { utilsSchema } from "./utilsSchema";

const rootSchema = `
    ${utilsSchema}
    ${userSchema}
    ${organizationSchema}
    ${boardSchema}
    ${taskSchema}
    ${collaborationRequestSchema}
    ${collaboratorsSchema}
    ${clientSchema}
    ${sprintSchema}
    ${systemSchema}
    ${endpointSchema}
`;

const compiledSchema = buildSchema(rootSchema);

export { compiledSchema as indexSchema, EndpointsGraphQLController };
