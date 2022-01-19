import { utilsSchema } from "../../utilsSchema";
import { buildSchema } from "graphql";
import collaborationRequestSchema from "../../../mongo/collaboration-request/definitions";

const schema = `
${utilsSchema}
${collaborationRequestSchema}
`;

describe("collaboration request schema tests", () => {
    test("schema compiles without errors", () => {
        buildSchema(schema);
    });
});
