import {SchemaDefinitionProperty} from 'mongoose';

export type MongoSchemaFields<T extends object> = {
  [path in keyof Required<T>]: SchemaDefinitionProperty<T[path]>;
};

// ensures all the fields defined in the type are added to the schema
// TODO: do deep check to make sure that internal schemas are checked too
// eslint-disable-next-line @typescript-eslint/ban-types
export function ensureMongoSchemaFields<T extends object>(
  schema: MongoSchemaFields<T>
): MongoSchemaFields<T> {
  return schema;
}
