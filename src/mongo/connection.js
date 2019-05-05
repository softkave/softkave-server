const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI;
// console.log(process.env);
const connection = mongoose.createConnection(MONGODB_URI, {
  //autoIndex: false,
  useNewUrlParser: true
});

connection.on("error", error => {
  throw error;
});

module.exports = {
  connection
};