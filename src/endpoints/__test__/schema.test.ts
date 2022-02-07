import { buildSchema } from "graphql";
import { rootSchema } from "..";

describe("server schema tests", () => {
    test("schema compiles without errors", () => {
        buildSchema(rootSchema);
    });
});
