const userRoleSchema = {
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
  roles: [userRoleSchema],
  changePasswordTokenIDs: [String]
};

export default userSchema;
export { userRoleSchema };
