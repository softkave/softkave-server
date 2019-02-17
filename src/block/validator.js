const isMongoId = require("validator/lib/isMongoId");
const isHexColor = require("validator/lib/isHexColor");
const asyncValidator = require("async-validator");
const util = require("util");
const { userDescriptor } = require("../user/validator");
const { RequestError } = require("../error");
const {
  mongoIdDescriptor,
  makeDescriptorFieldsRequired
} = require("../validation-utils");
const { blockTypesObj } = require("./utils");

const aclDescriptor = {
  action: {
    type: "string",
    max: 50,
    message: "value is invalid"
  },
  level: {
    type: "number",
    message: "value is invalid."
  }
};

const roleDescriptor = {
  role: {
    type: "string",
    max: 50,
    message: "value is invalid."
  },
  level: {
    type: "number"
  }
};

const aclValidator = new asyncValidator(aclDescriptor, { firstFields: true });
const roleValidator = new asyncValidator(roleDescriptor, { firstFields: true });

const blockDescriptor = {
  name: [
    {
      type: "string",
      max: 50,
      pattern: /\w/,
      message: "value is invalid."
    }
  ],
  description: [
    {
      type: "string",
      max: 250,
      pattern: /\w/,
      message: "value is invalid."
    }
  ],
  expectedEndAt: [
    {
      type: "number",
      message: "value is invalid."
    }
  ],
  completedAt: [
    {
      type: "number",
      message: "value is invalid."
    }
  ],
  color: [
    {
      validator: (rule, value) => {
        if (!isHexColor(value)) throw new Error("only hex colors are allowed.");
      }
    }
  ],
  type: [
    {
      type: "enum",
      enum: ["org", "project", "group", "task"],
      message: "value is invalid."
    }
  ],
  parents: [
    {
      type: "array",
      max: 10,
      message: "value is invalid.",
      validator: function(rule, value, cb) {
        let existingParents = {};
        let errorExist = value.some((parent, i) => {
          if (existingParents[value]) {
            cb("parent already exist in set.");
            return true;
          } else if (!isMongoId(parent)) {
            cb(`parent data at index ${i} is invalid.`);
            return true;
          }

          existingParents[value] = value;
          return false;
        });

        if (!errorExist) {
          cb();
        }
      }
    }
  ],
  data: [
    {
      type: "object",
      fields: {
        dataType: {
          type: "string",
          max: 50,
          message: "value is invalid."
        },
        data: {
          type: "string",
          max: 250,
          message: "value is invalid."
        }
      },
      message: "value is invalid."
    }
  ],
  acl: [
    {
      type: "array",
      max: 40,
      message: "value is invalid.",
      validator: function(rule, value, cb) {
        let existingAcl = {};
        let errorExist = false;
        errorExist = value.some((aclItem, i) => {
          if (existingAcl[aclItem.action]) {
            cb("action already exist in set.");
            errorExist = true;
            return true;
          }

          existingAcl[aclItem.action] = aclItem;
          aclValidator.validate(aclItem, (errors, fields) => {
            if (errors) {
              cb(`acl data at index ${i} is invalid`);
              errorExist = true;
            }
          });

          return errorExist;
        });

        if (!errorExist) {
          cb();
        }
      }
    }
  ],
  roles: [
    {
      type: "array",
      max: 10,
      message: "value is invalid.",
      validator: function(rule, value, cb) {
        let existingRoles = {};
        let errorExist = false;
        value.some((role, i) => {
          if (existingRoles[role.role]) {
            cb("role with the same name already exist.");
            errorExist = true;
            return true;
          }

          existingRoles[role.role] = role;
          roleValidator.validate(role, (errors, fields) => {
            if (errors) {
              cb(`role data at index ${i} is invalid`);
              errorExist = true;
            }
          });

          return errorExist;
        });

        if (!errorExist) {
          cb();
        }
      }
    }
  ],
  permission: userDescriptor.permission,
  id: mongoIdDescriptor
};

const blockValidator = new asyncValidator(blockDescriptor, {
  firstFields: true
});

const asyncBlockValidator = util.promisify(blockValidator.validate.bind(blockValidator));
const requiredAddTaskFields = ["description", "type", "data"];
const addTaskDescriptor = makeDescriptorFieldsRequired(
  blockDescriptor,
  requiredAddTaskFields
);

const addTaskValidator = new asyncValidator(addTaskDescriptor, {
  firstFields: true
});

const asyncAddTaskValidator = util.promisify(addTaskValidator.validate.bind(addTaskValidator));
const requiredAddGroupFields = ["name", "color", "type"];
const addGroupDescriptor = makeDescriptorFieldsRequired(
  blockDescriptor,
  requiredAddGroupFields
);

const addGroupValidator = new asyncValidator(addGroupDescriptor, {
  firstFields: true
});

const asyncAddGroupValidator = util.promisify(
  addGroupValidator.validate.bind(addGroupValidator)
);

const requiredAddProjectFields = ["name", "color", "type"];
const addProjectDescriptor = makeDescriptorFieldsRequired(
  blockDescriptor,
  requiredAddProjectFields
);

const addProjectValidator = new asyncValidator(addProjectDescriptor, {
  firstFields: true
});

const asyncAddProjectValidator = util.promisify(
  addProjectValidator.validate.bind(addProjectValidator)
);

const requiredAddOrgFields = [
  "name",
  "color",
  "type",
  "acl",
  "roles",
  "permission"
];

const addOrgDescriptor = makeDescriptorFieldsRequired(
  blockDescriptor,
  requiredAddOrgFields
);

const addOrgValidator = new asyncValidator(addOrgDescriptor, {
  firstFields: true
});

const asyncAddOrgValidator = util.promisify(
  addOrgValidator.validate.bind(addOrgValidator)
);

// Collaborator validators
const newCollaboratorDescriptor = {
  email: {
    type: "email",
    message: "value is invalid."
  },
  role: {
    type: "string",
    max: 50,
    message: "value is invalid."
  }
};

const newCollaboratorValidator = new asyncValidator(newCollaboratorDescriptor, {
  firstFields: true
});

const newCollaboratorsArrDescriptor = {
  data: {
    type: "array",
    max: 10,
    message: "value is invalid.",
    validator: function(rule, value, cb) {
      let existingCollaborators = {};
      let errorExist = false;
      value.some((val, i) => {
        if (existingCollaborators[val.email]) {
          cb("collaborator email already exist in set.");
          errorExist = true;
          return true;
        }

        existingCollaborators[val.email] = val;
        newCollaboratorValidator.validate(val, (errors, fields) => {
          if (errors) {
            cb(`collaborators data at index ${i} is invalid`);
            errorExist = true;
          }
        });

        return errorExist;
      });

      if (!errorExist) {
        cb();
      }
    }
  }
};

const newCollaboratorsArrValidator = new asyncValidator(
  newCollaboratorsArrDescriptor,
  { firstFields: true }
);

const asyncNewCollaboratorsArrValidator = util.promisify(
  newCollaboratorsArrValidator.validate.bind(newCollaboratorsArrValidator)
);

async function validateNewCollaborators(data) {
  return await asyncNewCollaboratorsArrValidator({ data });
}

async function validateBlockAdd(block) {
  switch (block.type) {
    case "org":
      return await asyncAddOrgValidator(block);

    case "project":
      return await asyncAddProjectValidator(block);

    case "group":
      return await asyncAddGroupValidator(block);

    case "task":
      return await asyncAddTaskValidator(block);

    default:
      throw new RequestError("error", "block type is invalid");
  }
}

async function validateBlock(block) {
  return await asyncBlockValidator(block);
}

function validateBlockId(blockId, fieldName) {
  if (!isMongoId(blockId)) {
    throw new RequestError(fieldName || "blockId", "value is invalid");
  }
}

function validateBlockType(type, fieldName) {
  if (!blockTypesObj[type]) {
    throw new RequestError(fieldName || "blockType", "is not valid type");
  }
}

module.exports = {
  validateBlockAdd,
  validateBlock,
  validateNewCollaborators,
  validateBlockId,
  validateBlockType,
  roleDescriptor
};
