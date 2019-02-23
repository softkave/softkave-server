const isMongoId = require("validator/lib/isMongoId");
const { RequestError } = require("./error");

const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{5,}$/;
const mongoIdDescriptor = [
  {
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

function joiMongoIdValidator(value, ()) {

}

module.exports = {
  passwordPattern,
  mongoIdDescriptor,
  makeDescriptorFieldsRequired,
  validateMongoId
};
