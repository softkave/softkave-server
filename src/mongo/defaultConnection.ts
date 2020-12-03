import MongoConnection from "./MongoConnection";

let conn: MongoConnection = null;

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
