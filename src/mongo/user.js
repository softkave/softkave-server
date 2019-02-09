const { connection } = require("./connection");
const makeModel = require("./makeModel");
const { blockPermissionSchema } = require("./block-permission");

const userSchema = {
  name: String,
  email: {
    type: String,
    unique: true
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
  permissions: {
    type: [blockPermissionSchema],
    index: true
  },
  lastNotificationCheckTime: Number
};

let userModel = makeModel(connection, userSchema, "user", "users");
module.exports = userModel;
