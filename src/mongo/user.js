const { connection } = require("./connection");
const makeModel = require("./makeModel");

const userSchema = {
  customId: { type: String, index: true },
  name: {
    type: String
  },
  email: {
    type: String,
    unique: true,
    index: true
  },
  hash: {
    type: String,
    index: true
  },
  createdAt: {
    type: Number,
    default: Date.now
  },
  forgotPasswordHistory: [Number],
  changePasswordHistory: [Number],
  lastNotificationCheckTime: Number,
  rootBlockId: String,
  orgs: [String]
};

let userModel = makeModel(connection, userSchema, "user", "users");
module.exports = userModel;
