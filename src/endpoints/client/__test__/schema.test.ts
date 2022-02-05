import { utilsSchema } from "../../utilsSchema";
import { buildSchema } from "graphql";
import clientSchema from "../schema";

const schema = `
${utilsSchema}
${clientSchema}
`;

describe("client schema tests", () => {
    test("schema compiles without errors", () => {
        buildSchema(schema);
    });
});
