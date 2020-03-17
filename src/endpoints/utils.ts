import { ServerError } from "../utilities/errors";
import logger from "../utilities/logger";

export const wrapEndpoint = async (data: any, req: any, endpoint: any) => {
  try {
    return await endpoint(data, req);
  } catch (error) {
    const errors = Array.isArray(error) ? error : [error];
    return {
      errors: errors.map(e => ({
        name: e.name,
        message: e.message,
        type: e.type,
        action: e.action,
        field: e.field
      }))
    };
  }
};

export const wrapDBCall = async <T>(fn: any, ...args): Promise<T> => {
  try {
    return await fn(...args);
  } catch (error) {
    logger.error(error);
    throw new ServerError();
  }
};

// Used for fire and forget
export const catchAndLogError = async (promise: Promise<any>) => {
  try {
    await promise;
  } catch (error) {
    logger.error(error);
    throw new ServerError();
  }
};
