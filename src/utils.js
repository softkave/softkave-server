const { extractError } = require("./error");

function wrapField(func) {
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

function defaultArrToMapIndexer(item) {
  return item;
}

function indexArr(arr, indexer = defaultArrToMapIndexer) {
  let result = {};

  arr.forEach(item => {
    let index = indexer(item);
    result[index] = item;
  });

  return result;
}

module.exports = {
  wrapField,
  indexArr
};
