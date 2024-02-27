import assert = require('assert');
import MongoConnection from './MongoConnection';

let conn: MongoConnection | null = null;

// TODO: if function is called more than once and connection is not ready,
// a new connection is going to be created and the last to be created is the
// one that gets cached
export function getDefaultMongoConnection() {
  if (conn) {
    return conn;
  }

  const mongoUri = process.env.MONGODB_URI;
  const dbName = process.env.DB_NAME;
  assert(mongoUri);
  assert(dbName);
  conn = new MongoConnection(mongoUri, {dbName});
  return conn;
}
