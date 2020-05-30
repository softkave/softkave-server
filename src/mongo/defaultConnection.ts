import MongoConnection from "./MongoConnection";

let conn: MongoConnection = null;

export function getDefaultConnection() {
  if (conn) {
    return conn;
  }

  const MONGODB_URI = process.env.MONGODB_URI;
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  conn = new MongoConnection(MONGODB_URI, options);
  return conn;
}
