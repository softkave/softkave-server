import MongoConnection from "./MongoConnection";

const MONGODB_URI = process.env.MONGODB_URI;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

const connection = new MongoConnection(MONGODB_URI, options);

export default connection;
