import { SchemaDefinition } from "mongoose";

// ensures all the fields defined in the type are added to the schema
export function ensureTypeFields<T extends object>(
    schema: SchemaDefinition<T>
): SchemaDefinition<T> {
    return schema;
}
