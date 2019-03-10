const {
  trimInput
} = require("./validation-utils");

function wrapField(func) {
  return async function (...args) {
    try {
      return await func(...args);
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error(error);
      }

      if (Array.isArray(error)) {
        return {
          errors: error
        };
      } else if (error.name || error.code || error.message) {
        return {
          errors: [{
            field: error.field || "error",
            message: error.message || "server error"
          }]
        };
      } else if (error.errors) {
        return error;
      } else {
        return {
          errors: [{
            field: "error",
            message: "server error"
          }]
        };
      }
    }
  };
}

function defaultArrToMapIndexer(item) {
  return item;
}

function arrToMap(arr) {
  let result = {};

  arr.forEach(item => {
    result[item] = 1;
  });

  return result;
}

function indexArr(arr, indexer = defaultArrToMapIndexer) {
  let result = {};

  arr.forEach(item => {
    let index = indexer(item);
    result[index] = item;
  });

  return result;
}

function objValuesToArray(obj) {
  if (Object.values) {
    return Object.values(obj);
  }

  let result = [];

  for (const key in obj) {
    let value = obj[key];
    result.push(value);
  }

  return result;
}

function trimObject(obj, exclude = {}) {
  for (const key in obj) {
    let value = obj[key];

    if (!exclude[key]) {
      if (typeof value === "string") {
        obj[key] = trimInput(value);
      } else if (typeof value === "object") {
        obj[key] = trimObject(value);
      }
    }
  }

  return obj;
}

module.exports = {
  wrapField,
  arrToMap,
  indexArr,
  objValuesToArray,
  trimObject
};