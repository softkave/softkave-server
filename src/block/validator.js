// const isMongoId = require("validator/lib/isMongoId");
const isHexColor = require("validator/lib/isHexColor");
const asyncValidator = require("async-validator");
const {
  RequestError
} = require("../error");
const {
  mongoIdDescriptor,
  makeDescriptorFieldsRequired,
  trimInput,
  stringPattern,
  promisifyValidator,
  validateUUID,
  uuidDescriptor,
  validateString
} = require("../validation-utils");
const {
  blockTypesObj,
  blockTypes
} = require("./utils");
const {
  actionsMap,
  actions,
  taskActionsMap,
  groupActionsMap,
  projectActionsMap,
  orgActionsMap
} = require("./actions");
const {
  indexArr
} = require("../utils");

const defaultErrorMessage = defaultErrorMessage;
const aclDescriptor = {
  action: {
    type: "string",
    transform: trimInput,
    validator(rule, val, cb) {
      if (!actionsMap[val]) {
        cb("action is invalid");
      } else {
        cb();
      }
    }
  },
  roles: {
    type: "array",
    message: defaultErrorMessage,
    transform(value) {
      if (Array.isArray(value)) {
        let map = {};
        value.forEach(role => {
          map[trimInput(role)] = true;
        });

        return Object.keys(map);
      }

      throw new RequestError("roles", defaultErrorMessage);
    },
    validator(value) {
      value.forEach(role => {
        if (!stringPattern.test(role)) {
          throw new RequestError("roles", defaultErrorMessage);
        }
      });
    }
  }
};

const roleDescriptor = {
  role: {
    type: "string",
    pattern: stringPattern,
    transform: trimInput,
    max: 50,
    message: defaultErrorMessage
  },
  hierarchy: {
    type: "number",
    message: defaultErrorMessage
  }
};

const arbitraryDataDescriptor = {
  dataType: {
    type: "string",
    pattern: stringPattern,
    transform: trimInput,
    max: 50,
    message: defaultErrorMessage
  },
  data: {
    type: "string",
    max: 250,
    message: defaultErrorMessage
  }
};

const taskCollaboratorsDescriptor = {
  userId: mongoIdDescriptor,
  completedAt: {
    type: "number",
    message: defaultErrorMessage
  },
  assignedAt: {
    type: "number",
    message: defaultErrorMessage
  },
  assignedBy: mongoIdDescriptor,
  expectedEndAt: {
    type: "number",
    message: defaultErrorMessage
  }
};

const aclValidator = new asyncValidator(aclDescriptor, {
  firstFields: true
});

const validateAcl = promisifyValidator(aclValidator);
const roleValidator = new asyncValidator(roleDescriptor, {
  firstFields: true
});

const validateRole = promisifyValidator(roleValidator);
const arbitraryDataValidator = new asyncValidator(arbitraryDataDescriptor, {
  firstFields: true
});

const validateArbitraryData = promisifyValidator(arbitraryDataValidator);

const taskCollaboratorsValidator = new asyncValidator(
  taskCollaboratorsDescriptor, {
    firstFields: true
  }
);

const validateTaskCollaborator = promisifyValidator(taskCollaboratorsValidator);

const blockDescriptor = {
  name: [{
    type: "string",
    transform: trimInput,
    max: 50,
    pattern: stringPattern,
    message: defaultErrorMessage
  }],
  description: [{
    type: "string",
    max: 250,
    pattern: stringPattern,
    message: defaultErrorMessage
  }],
  expectedEndAt: [{
    type: "number",
    message: defaultErrorMessage
  }],
  completedAt: [{
    type: "number",
    message: defaultErrorMessage
  }],
  color: [{
    validator: (rule, value) => {
      if (!isHexColor(value)) throw new Error("only hex colors are allowed");
    }
  }],
  type: [{
    type: "enum",
    transform: trimInput,
    enum: blockTypes,
    message: defaultErrorMessage
  }],
  parents: [{
    type: "array",
    max: 10,
    message: defaultErrorMessage,
    transform(value) {
      if (Array.isArray(value)) {
        let map = {};
        value.forEach(parent => {
          map[trimInput(parent)] = true;
        });

        return Object.keys(map);
      }

      throw new RequestError("parents", defaultErrorMessage);
    },
    validator: function (rule, value, cb) {
      value.forEach(async (parent) => {
        await validateString(parent);
      });

      cb();
    }
  }],
  acl: [{
    type: "array",
    transform(value) {
      if (Array.isArray(value)) {
        let actionsMap = indexArr(value, item => item.action);
        return Object.values(actionsMap);
      }

      throw new RequestError("acl", defaultErrorMessage);
    },
    max: actions.length,
    message: defaultErrorMessage,
    validator: function (rule, value, cb) {
      value.forEach(async (aclItem, i) => {
        await validateAcl(aclItem);
      });

      cb();
    }
  }],
  roles: [{
    type: "array",
    transform() {
      if (Array.isArray(value)) {
        let map = {};
        value.forEach(role => {
          map[trimInput(role)] = true;
        });

        return Object.keys(map);
      }

      throw new RequestError("roles", defaultErrorMessage);
    },
    max: 15,
    message: defaultErrorMessage,
    validator: function (rule, value, cb) {
      value.forEach(async (role) => {
        await validateRole(role);
      });

      cb();
    }
  }],
  id: uuidDescriptor,
  priority: {
    type: "enum",
    transform: trimInput,
    enum: ["not important", "important", "very important"],
    message: defaultErrorMessage
  },
  taskCollaborators: [{
    type: "array",
    max: 25,
    validator(rule, value, cb) {
      value.forEach(async (c) => {
        await validateTaskCollaborator(c);
      });

      cb();
    }
  }]
};

const blockValidator = new asyncValidator(blockDescriptor, {
  firstFields: true
});

const asyncBlockValidator = promisifyValidator(blockValidator);
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

const asyncAddTaskValidator = promisifyValidator(addTaskValidator);

const requiredAddGroupFields = ["name", "color", "type", "acl", "parents"];
const addGroupDescriptor = makeDescriptorFieldsRequired(
  blockDescriptor,
  requiredAddGroupFields
);

const addGroupValidator = new asyncValidator(addGroupDescriptor, {
  firstFields: true
});

const asyncAddGroupValidator = promisifyValidator(addGroupValidator);

const requiredAddProjectFields = ["name", "color", "type", "acl", "parents"];
const addProjectDescriptor = makeDescriptorFieldsRequired(
  blockDescriptor,
  requiredAddProjectFields
);

const addProjectValidator = new asyncValidator(addProjectDescriptor, {
  firstFields: true
});

const asyncAddProjectValidator = promisifyValidator(addProjectValidator);

const requiredAddOrgFields = [
  "name",
  "color",
  "type",
  "acl",
  "roles",
  "role"
];

const addOrgDescriptor = makeDescriptorFieldsRequired(
  blockDescriptor,
  requiredAddOrgFields
);

const addOrgValidator = new asyncValidator(addOrgDescriptor, {
  firstFields: true
});

const asyncAddOrgValidator = promisifyValidator(addOrgValidator);

// Collaborator validators
const newCollaboratorDescriptor = {
  id: uuidDescriptor,
  email: {
    type: "email",
    transform: trimInput,
    message: defaultErrorMessage
  },
  body: blockDescriptor.description,
  expiresAt: {
    type: "number",
    message: defaultErrorMessage
  }
};

const newCollaboratorValidator = new asyncValidator(newCollaboratorDescriptor, {
  firstFields: true
});

const validateNewCollaborator = promisifyValidator(newCollaboratorValidator);
const newCollaboratorsArrDescriptor = {
  data: {
    type: "array",
    max: 20,
    message: defaultErrorMessage,
    validator: function (rule, value, cb) {
      value.forEach(async (val) => {
        await validateNewCollaborator(val);
      });

      cb();
    }
  }
};

const newCollaboratorsArrValidator = new asyncValidator(
  newCollaboratorsArrDescriptor, {
    firstFields: true
  }
);

const asyncNewCollaboratorsArrValidator = promisifyValidator(newCollaboratorsArrValidator);

async function validateNewCollaborators(data) {
  return await asyncNewCollaboratorsArrValidator({
    data
  });
}

function validateBlockAcl(block) {
  let checkIn = null;

  switch (block.type) {
    case "org":
      checkIn = orgActionsMap;
      break;

    case "project":
      checkIn = projectActionsMap;
      break;

    case "group":
      checkIn = groupActionsMap;
      break;

    case "task":
      checkIn = taskActionsMap;
      break;

    default:
      throw new RequestError("type", "block type is invalid");
  }

  block.acl.forEach(acl => {
    if (!checkIn[acl.action]) {
      throw new RequestError("acl", `type ${acl.action} in invalid`);
    }
  });

  return true;
}

async function validateBlockAdd(block) {
  switch (block.type) {
    case "org":
      if (!block.role) {
        throw new RequestError("role", "role is empty");
      }

      await asyncAddOrgValidator(block);
      break;

    case "project":
      await asyncAddProjectValidator(block);
      break;

    case "group":
      await asyncAddGroupValidator(block);
      break;

    case "task":
      await asyncAddTaskValidator(block);
      break;

    default:
      throw new RequestError("error", "block type is invalid");
  }

  return validateBlockAcl(block);
}

async function validateBlock(block) {
  return await asyncBlockValidator(block);
}

function validateBlockId(blockId, fieldName, message) {
  // if (!isMongoId(blockId)) {
  //   throw new RequestError(fieldName || "blockId", defaultErrorMessage);
  // }

  return validateUUID(blockId, fieldName, message);
}

function validateBlockType(type, fieldName) {
  if (!blockTypesObj[type]) {
    throw new RequestError(fieldName || "type", "is not valid type");
  }
}

module.exports = {
  validateBlockAdd,
  validateBlock,
  validateNewCollaborators,
  validateBlockId,
  validateBlockType,
  roleDescriptor,
  validateRole,
  validateBlockAcl,
  validateBlock,
  validateArbitraryData
};