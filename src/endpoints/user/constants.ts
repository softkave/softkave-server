const userConstants = {
  minNameLength: 1,
  maxNameLength: 300,
  minPasswordLength: 5,
  maxPasswordLength: 20
};

const userFieldNames = {
  customId: "customId",
  name: "name",
  email: "email",
  hash: "hash",
  createdAt: "createdAt",
  forgotPasswordHistory: "forgotPasswordHistory",
  changePasswordHistory: "changePasswordHistory",
  lastNotificationCheckTime: "lastNotificationCheckTime",
  rootBlockId: "rootBlockId",
  orgs: "orgs",
  color: "color"
};

module.exports = { userConstants, userFieldNames };
export {};
