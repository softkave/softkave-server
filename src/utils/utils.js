const get = require("lodash/get");

function defaultIndexer(data, path) {
  if (path) {
    return get(data, path);
  }

  return JSON.stringify(data);
}

function indexArray(arr = [], { path, indexer } = {}) {
  if (typeof indexer !== "function") {
    if (typeof path !== "string") {
      console.error(
        new Error("Path must be provided if an indexer is not provided")
      );

      return {};
    }

    indexer = defaultIndexer;
  }

  let result = arr.reduce((accumulator, current) => {
    accumulator[indexer(current, path, arr)] = current;
    return accumulator;
  }, {});

  return result;
}

module.exports = {
  indexArray
};
