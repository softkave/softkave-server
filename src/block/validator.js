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
const { blockTypesObj, blockTypes } = require("./utils");
const { actionsMap, actions } = require("./actions");

const aclDescriptor = {
  action: {
    type: "string",
    validator(rule, val, cb) {
      if (!actionsMap(val)) {
        cb("action is invalid");
      } else {
        cb();
      }
    }
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
    type: "number",
    message: "value is invalid."
  }
};

const arbitraryDataDescriptor = {
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
};

const taskCollaboratorsDescriptor = {
  type: "object",
  fields: {
    userId: mongoIdDescriptor,
    // data: dataSchema,
    completedAt: { type: "number" },
    assignedAt: { type: "number" },
    assignedBy: mongoIdDescriptor,
    expectedEndAt: { type: "number" }
  }
};

const aclValidator = new asyncValidator(aclDescriptor, { firstFields: true });
const roleValidator = new asyncValidator(roleDescriptor, { firstFields: true });
const arbitraryDataValidator = new asyncValidator(arbitraryDataDescriptor, {
  firstFields: true
});

const taskCollaboratorsValidator = new asyncValidator(
  taskCollaboratorsDescriptor,
  { firstFields: true }
);

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
  // completedAt: [
  //   {
  //     type: "number",
  //     message: "value is invalid."
  //   }
  // ],
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
      enum: blockTypes,
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
        value.some((parent, i) => {
          if (existingParents[value]) {
            cb("parent already exist in set.");
            return true;
          } else if (!isMongoId(parent)) {
            cb(`parent data at index ${i} is invalid.`);
            return true;
          }

          existingParents[value] = value;
          if (i === value.length - 1) {
            cb();
          }

          return false;
        });
      }
    }
  ],
  acl: [
    {
      type: "array",
      max: actions.length,
      message: "value is invalid.",
      validator: function(rule, value, cb) {
        let existingAcl = {};
        let errors = [];
        value.forEach((aclItem, i) => {
          aclValidator.validate(aclItem, (err, fields) => {
            if (err) {
              errors.push(`acl data at index ${i} is invalid`);
            } else {
              if (existingAcl[aclItem.action]) {
                errors.push(`acl data at index ${i} is invalid`);
              }

              existingAcl[aclItem.action] = aclItem;
            }

            if (i === value.length - 1) {
              cb(errors.length > 0 ? errors : null);
            }
          });
        });
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
        let errors = [];
        value.forEach((role, i) => {
          roleValidator.validate(role, (err, fields) => {
            if (err) {
              cb(`role data at index ${i} is invalid`);
            } else {
              if (existingRoles[role.role]) {
                errors.push("role with the same name already exist");
              }

              existingRoles[role.role] = role;
            }

            if (i === value.length - 1) {
              cb(errors.length > 0 ? errors : null);
            }
          });
        });
      }
    }
  ],
  permission: userDescriptor.permission,
  id: mongoIdDescriptor,
  priority: {
    type: "enum",
    enum: ["not important", "important", "very important"],
    message: "value is invalid"
  },
  taskCollaborators: [
    {
      type: "array",
      max: 20,
      validator(rule, value, cb) {
        let existingCollaborators = {};
        let errors = [];
        value.forEach((c, i) => {
          taskCollaboratorsValidator.validate(c, (err, fields) => {
            if (err) {
              cb(`data at index ${i} is invalid`);
            } else {
              if (existingCollaborators[c.userId]) {
                cb("duplicate collaborator");
              }

              existingCollaborators[c.userId] = c;
            }

            if (i === value.length - 1) {
              cb(errors.length > 0 ? errors : null);
            }
          });
        });
      }
    }
  ]
};

const blockValidator = new asyncValidator(blockDescriptor, {
  firstFields: true
});

const asyncBlockValidator = util.promisify(
  blockValidator.validate.bind(blockValidator)
);

const requiredAddTaskFields = [
  "description",
  "type",
  "priority",
  "acl",
  "parents"
];
const addTaskDescriptor = makeDescriptorFieldsRequired(
  blockDescriptor,
  requiredAddTaskFields
);

const addTaskValidator = new asyncValidator(addTaskDescriptor, {
  firstFields: true
});

const asyncAddTaskValidator = util.promisify(
  addTaskValidator.validate.bind(addTaskValidator)
);
const requiredAddGroupFields = ["name", "color", "type", "acl", "parents"];
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

const requiredAddProjectFields = ["name", "color", "type", "acl", "parents"];
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
  body: blockDescriptor.description,
  expiresAt: {
    type: "number",
    message: "value is invalid."
  }
};

const newCollaboratorValidator = new asyncValidator(newCollaboratorDescriptor, {
  firstFields: true
});

const newCollaboratorsArrDescriptor = {
  data: {
    type: "array",
    max: 20,
    message: "value is invalid",
    validator: function(rule, value, cb) {
      let existingCollaborators = {};
      let errors = [];
      value.forEach((val, i) => {
        newCollaboratorValidator.validate(val, (err, fields) => {
          if (err) {
            errors.push(`collaborators data at index ${i} is invalid`);
          } else {
            if (existingCollaborators[val.email]) {
              errors.push("collaborator email already exist in set");
            }

            existingCollaborators[val.email] = val;
          }

          if (i === value.length - 1) {
            cb(errors.length > 0 ? errors : null);
          }
        });
      });
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
