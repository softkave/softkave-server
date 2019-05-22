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
    const insertData = inserts.reduce((accumulator, current) => {
      const result = await current(accumulator);
      return { ...accumulator, ...result }
    }, initialParams);

    return wrappedFunc({ ...initialParams, ...insertData });
  };
}

async function insertUserCredentials({ req }) {
  const tokenData = req.user;
  const user = await getUserFromReq(req);
  return { tokenData, user };
}

module.exports = {
  wrapGraphQLOperation,
  wrapGraphQLOperationForErrors,
  insertUserCredentials
};
