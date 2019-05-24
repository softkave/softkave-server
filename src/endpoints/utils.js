const getUserFromReq = require("../utils/getUserFromReq");

function wrapGraphQLOperationForErrors(func) {
  return async function(...args) {
    try {
      return await func(...args);
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error(error);
      }

      if (Array.isArray(error)) {
        return {
          errors: extractError(error)
        };
      } else if (error.name || error.code || error.message) {
        // TODO: remove in favor of detailed logging
        if (error.field === "error") {
          console.error(error);
        }

        return {
          errors: [
            {
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

function wrapGraphQLOperation(func, staticParams, inserts = []) {
  const wrappedFunc = wrapGraphQLOperationForErrors(func);
  return async function(params, req) {
    const initialParams = { ...staticParams, ...params, req };
    let reducedParams = initialParams;

    for (let insertFunc of inserts) {
      const result = await insertFunc(reducedParams);
      reducedParams = { ...reducedParams, ...result };
    }

    return wrappedFunc({ ...initialParams, ...reducedParams });
  };
}

async function insertUserCredentials({ req }) {
  const tokenData = req.user;
  const user = await getUserFromReq(req);
  return { tokenData, user };
}

async function insertChangePasswordCredentials({ req }) {
  const tokenData = req.user;
  const user = await getUserFromReq(req, "change-password");
  return { tokenData, user };
}

module.exports = {
  wrapGraphQLOperation,
  wrapGraphQLOperationForErrors,
  insertUserCredentials,
  insertChangePasswordCredentials
};
