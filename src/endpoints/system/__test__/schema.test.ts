import { utilsSchema } from "../../utilsSchema";
import { buildSchema } from "graphql";
import systemSchema from "../schema";

const schema = `
${utilsSchema}
${systemSchema}
`;

describe("system schema tests", () => {
    test("schema compiles without errors", () => {
        buildSchema(schema);
    });
});
