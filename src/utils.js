const set = require("lodash/set");

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
          errors: error
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

function transformPaths(data, paths) {
  function op(x, options) {
    if (x) {
      x = String(x);

      if (!!options.trim) {
        x = x.trim();
      }

      if (!!options.lowercase) {
        x = x.toLowerCase();
      }
    }

    return x;
  }

  function next(x, splitPath, index, cb, builtPath = "", options, data) {
    if (index < splitPath.length) {
      if (x) {
        if (Array.isArray(x)) {
          x.forEach((xData, i) => {
            builtPath = builtPath + "." + i;
            next(xData, splitPath, index, cb, builtPath, options, data);
          });
        } else {
          const path = splitPath[index];
          builtPath = builtPath + "." + path;
          next(x[path], splitPath, index + 1, cb, builtPath, options, data);
        }
      } else {
        cb();
      }
    } else {
      cb(builtPath, x, options, data);
    }
  }

  function applyOp(path, x, options, data) {
    const value = op(x, options);
    set(data, path, value);
  }

  Object.keys(paths).forEach(path => {
    const options = paths[path];
    const splitPath = path.split(".");
    next(data, splitPath, 0, applyOp, "", options, data);
  });
}

module.exports = {
  wrapField,
  indexArr,
  transformPaths
};
