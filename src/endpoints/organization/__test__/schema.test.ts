import { utilsSchema } from "../../utilsSchema";
import organizationSchema from "../schema";
import { buildSchema } from "graphql";

const schema = `
${utilsSchema}
${organizationSchema}
`;

describe("organization schema tests", () => {
    test("schema compiles without errors", () => {
        buildSchema(schema);
    });
});
