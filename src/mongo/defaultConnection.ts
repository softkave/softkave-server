import MongoConnection from "./MongoConnection";

let conn: MongoConnection = null;

// TODO: if function is called more than once and connection is not ready,
// a new connection is going to be created and the last to be created is the
// one that gets cached
export function getDefaultConnection() {
    if (conn) {
        return conn;
    }

    const MONGODB_URI = process.env.MONGODB_URI;

    conn = new MongoConnection(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    });

    return conn;
}
