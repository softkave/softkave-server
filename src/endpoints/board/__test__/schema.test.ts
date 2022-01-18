import { utilsSchema } from "../../utilsSchema";
import boardSchema from "../schema";
import { buildSchema } from "graphql";

const schema = `
${utilsSchema}
${boardSchema}
`;

describe("board schema tests", () => {
    test("schema compiles without errors", () => {
        buildSchema(schema);
    });
});
