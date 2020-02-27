import { buildSchema } from "graphql";
import { utilitySchema } from "../utilities/schema-utils";
import blockSchema from "./block/schema";
import EndpointController from "./controller";
import endpointSchema from "./schema";
import userSchema from "./user/schema";

const rootSchema = `
  ${utilitySchema}
  ${userSchema}
  ${blockSchema}
  ${endpointSchema}
`;

const compiledSchema = buildSchema(rootSchema);

export { compiledSchema as indexSchema, EndpointController };
