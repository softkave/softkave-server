import getUserFromRequest from "../utils/getUserFromRequest";
import OperationError from "../utils/OperationError";

// TODO: define all any types
function wrapGraphQLOperationForErrors(func: any) {
  return async (...args: any) => {
    try {
      return await func(...args);
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.log(error);
      }

      if (Array.isArray(error)) {
        return {
          /**
           * Remove error stack and other thrown error bits,
           * to prevent the graphql runtime from handling the error for us
           */
          errors: error.map((e: OperationError) => ({
            field: e.field,
            message: e.message,
            type: e.type,
            action: e.action
          }))
        };
      } else if (error.name || error.code || error.message) {
        // TODO: remove in favor of detailed logging
        if (error.field === "error") {
          console.error(error);
        }

        return {
          errors: [
            {
              ...error,
              field: error.field || "error",
              message: error.message || "server error"
            }
          ]
        };
      } else if (error.errors) {
        return error;
      } else {
        return {
          errors: [
            {
              field: "error",
              message: "server error"
            }
          ]
        };
      }
    }
  };
}

function wrapGraphQLOperation(func: any, staticParams: any, inserts: any = []) {
  const wrappedFunc = wrapGraphQLOperationForErrors(func);
  return async (params: any, req: any) => {
    const initialParams = { ...staticParams, ...params, req };
    let reducedParams = initialParams;

    for (const insertFunc of inserts) {
      const result = await insertFunc(reducedParams);
      reducedParams = { ...reducedParams, ...result };
    }

    return wrappedFunc({ ...initialParams, ...reducedParams });
  };
}

async function insertUserCredentials(params: any) {
  const { req, userModel } = params;
  const tokenData = req.user;
  const user = await getUserFromRequest({ req, userModel });
  return { tokenData, user };
}

async function insertChangePasswordCredentials({ req, userModel }: any) {
  const tokenData = req.user;
  const user = await getUserFromRequest({
    req,
    userModel,
    domain: "change-password"
  });

  return { tokenData, user };
}

export {
  wrapGraphQLOperation,
  wrapGraphQLOperationForErrors,
  insertUserCredentials,
  insertChangePasswordCredentials
};
