import { utilsSchema } from "../../utilsSchema";
import { buildSchema } from "graphql";
import collaboratorsSchema from "../schema";

const schema = `
${utilsSchema}
${collaboratorsSchema}
`;

describe("collaborator endpoint schema tests", () => {
    test("schema compiles without errors", () => {
        buildSchema(schema);
    });
});
