import { utilsSchema } from "../../utilsSchema";
import { buildSchema } from "graphql";
import taskSchema from "../schema";

const schema = `
${utilsSchema}
${taskSchema}
`;

describe("board schema tests", () => {
    test("schema compiles without errors", () => {
        buildSchema(schema);
    });
});
