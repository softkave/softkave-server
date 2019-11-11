export default function extractFieldNames<
  ObjectDefinition extends { [key: string]: any },
  ReturnType = { [K in keyof ObjectDefinition]: K }
>(schema: ObjectDefinition): ReturnType {
  const keys = Object.keys(schema);
  const fieldNames = keys.reduce((accumulator, key) => {
    accumulator[key] = key;
    return accumulator;
  }, {});

  return fieldNames as ReturnType;
}
