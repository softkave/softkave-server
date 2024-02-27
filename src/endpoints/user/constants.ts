export const userConstants = {
  minNameLength: 1,
  maxNameLength: 300,
  minPasswordLength: 7,
  maxPasswordLength: 20,
  maxEmailConfirmationCount: 3,
  newAnonymousUserEmail: (userId: string) => `${userId}@softkave.com`,
};
