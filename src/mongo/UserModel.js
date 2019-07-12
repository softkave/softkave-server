const MongoModel = require("./MongoModel");

const roleSchema = {
  roleName: String,
  orgId: String,
  assignedAt: Number,
  assignedBy: String
};

const userSchema = {
  customId: { type: String, unique: true },
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
  orgs: [String],
  color: String,
  roles: [roleSchema]
};

const modelName = "user";
const collectionName = "users";

class UserModel extends MongoModel {
  constructor({ connection }) {
    super({
      connection,
      modelName,
      collectionName,
      rawSchema: userSchema
    });
  }
}

module.exports = UserModel;
