import logger from "../utilities/logger";

export const wrapEndpoint = async (data: any, req: any, endpoint: any) => {
  try {
    return await endpoint(data, req);
  } catch (error) {
    const errors = Array.isArray(error) ? error : [error];
    console.error(error);
    return {
      errors: errors.map((err) => ({
        name: err.name,
        message: err.message,
        action: err.action,
        field: err.field,
      })),
    };
  }
};

export const fireAndForgetFn = async <Fn extends (...args: any) => any>(
  fn: Fn,
  ...args: Array<Parameters<Fn>>
): Promise<ReturnType<Fn>> => {
  try {
    return await fn(...args);
  } catch (error) {
    console.error(error);
  }
};

export const fireAndForgetPromise = async <T>(promise: Promise<T>) => {
  try {
    return await promise;
  } catch (error) {
    console.error(error);
  }
};

export enum JWTEndpoints {
  ChangePassword = "change-password",
  Login = "login",
}

export enum ServerRecommendedActions {
  LoginAgain = "login-again",
}
