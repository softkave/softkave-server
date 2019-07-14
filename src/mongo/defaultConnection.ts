const MongoConnection = require("./MongoConnection");

const MONGODB_URI = process.env.MONGODB_URI;
const options = {
  useNewUrlParser: true
};

const connection = new MongoConnection(MONGODB_URI, options);

module.exports = { connection };
export {};
