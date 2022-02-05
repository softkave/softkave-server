import { utilsSchema } from "../../utilsSchema";
import { buildSchema } from "graphql";
import sprintSchema from "../schema";

const schema = `
${utilsSchema}
${sprintSchema}
`;

describe("sprint schema tests", () => {
    test("schema compiles without errors", () => {
        buildSchema(schema);
    });
});
