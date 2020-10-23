import { buildSchema } from "graphql";
import { utilitySchema } from "../utilities/schema-utils";
import blockSchema from "./block/schema";
import EndpointController from "./controller";
import noteSchema from "./note/schema";
import endpointSchema from "./schema";
import sprintSchema from "./sprint/schema";
import userSchema from "./user/schema";

const rootSchema = `
    ${utilitySchema}
    ${userSchema}
    ${blockSchema}
    ${noteSchema}
    ${sprintSchema}
    ${endpointSchema}
`;

const compiledSchema = buildSchema(rootSchema);

export { compiledSchema as indexSchema, EndpointController };
