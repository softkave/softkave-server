import { utilsSchema } from "../../utilsSchema";
import { buildSchema } from "graphql";
import userSchema from "../schema";
import clientSchema from "../../client/schema";

const schema = `
${utilsSchema}
${clientSchema}
${userSchema}
`;

describe("user schema tests", () => {
    test("schema compiles without errors", () => {
        buildSchema(schema);
    });
});
