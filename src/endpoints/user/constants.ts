export const userConstants = {
  minNameLength: 1,
  maxNameLength: 300,
  minPasswordLength: 7,
  maxPasswordLength: 20,
  currentTokenVersion: 3,
};

export const userJWTEndpoints = {
  changePassword: "change-password",
  login: "login",
};

export const userErrorActions = {
  loginAgain: "login-again",
};
