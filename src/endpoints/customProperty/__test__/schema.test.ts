import { utilsSchema } from "../../utilsSchema";
import { buildSchema } from "graphql";
import customPropertySchema from "../schema";

const schema = `
${utilsSchema}
${customPropertySchema}
`;

describe("custom property schema tests", () => {
    test("schema compiles without errors", () => {
        buildSchema(schema);
    });
});
