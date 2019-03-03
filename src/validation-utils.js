const isMongoId = require("validator/lib/isMongoId");
const { RequestError } = require("./error");

const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{5,}$/;
const mongoIdDescriptor = [
  {
    transform: trimInput,
    validator: (rule, value, cb) => {
      if (!isMongoId(value)) {
        cb("value is invalid.");
      } else {
        cb();
      }
    }
  }
];

function makeDescriptorFieldsRequired(descriptor, fields = []) {
  fields.forEach(field => {
    let rule = descriptor[field];

    if (rule) {
      let replaceRule = [{ required: true }];

      if (Array.isArray(rule)) {
        replaceRule = replaceRule.concat(rule);
      } else {
        replaceRule.push(rule);
      }

      descriptor[field] = replaceRule;
    }
  });

  return descriptor;
}

function validateMongoId(id) {
  if (!isMongoId(id)) {
    throw new RequestError("error", "id is invalid");
  }
}

function trimInput(input) {
  return input.trim();
}

function addTrimToDescriptor(descriptor = {}) {
  Object.keys(descriptor, rule => {
    if (rule.type === "string") {
      if (!rule.transform) {
        rule.transform = trimInput;
      } else {
        const existingTransformer = rule.transform;
        rule.transform = ruleTransform;

        function ruleTransform(val) {
          let result = existingTransformer(val);
          result = trimInput(val);
          return result;
        }
      }
    }
  });

  return descriptor;
}

function makeArrTrim(field) {
  if (field && !Array.isArray(field)) {
    field = [field];
  }

  return function(arr) {
    arr.map(item => {
      if (field) {
        field.forEach(key => {
          let val = item[key];
          item[key] = trimInput(val);
        });
      } else {
        item = trimInput(item);
      }

      return item;
    });
  };
}

function promisifyValidator(validator) {
  let validateFunc = validator.validate.bind(validator);
  return function(...arg) {
    return new Promise((resolve, reject) => {
      validateFunc(...arg, (err, fields) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  };
}

function validateUUID(id) {}

module.exports = {
  passwordPattern,
  mongoIdDescriptor,
  makeDescriptorFieldsRequired,
  validateMongoId,
  trimInput,
  addTrimToDescriptor,
  makeArrTrim,
  promisifyValidator,
  validateUUID
};
