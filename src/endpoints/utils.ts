import { ServerError } from "../utilities/errors";
import logger from "../utilities/logger";

export const wrapEndpoint = async (data: any, req: any, endpoint: any) => {
  try {
    return await endpoint(data, req);
  } catch (error) {
    const errors = Array.isArray(error) ? error : [error];
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
    logger.error(error);
  }
};

export const fireAndForgetPromise = async <T>(promise: Promise<T>) => {
  try {
    return await promise;
  } catch (error) {
    logger.error(error);
  }
};
