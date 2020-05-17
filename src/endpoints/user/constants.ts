export const userConstants = {
  minNameLength: 1,
  maxNameLength: 300,
  minPasswordLength: 7,
  maxPasswordLength: 20,

  currentTokenVersion: 2,
};

export const userEndpoints = {
  changePassword: "change-password",
  login: "login",
};

export const userErrorActions = {
  loginAgain: "login-again",
};
