const MongoModel = require("./MongoModel");

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
  color: String
};

class UserModel extends MongoModel {
  constructor({ connection }) {
    super({
      connection,
      rawSchema: userSchema,
      modelName: "user",
      collectionName: "users"
    });
  }
}

module.exports = UserModel;
