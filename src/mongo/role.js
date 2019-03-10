const {
  connection
} = require("./connection");
const makeModel = require("./makeModel");

const schema = {
  name: {
    type: String,
    index: true,
    trim: true,
    lowercase: true
  },
  permissions: {
    type: [{
      action: {
        type: String,
        trim: true
      }
    }],
    index: true
  },
  blockId: {
    type: {
      type: String,
      trim: true
    },
    index: true
  },
  hierarchy: Number,
  createdAt: Number,
  updatedAt: Number
};

const roleModel = makeModel(
  connection,
  schema,
  "role",
  "roles"
);

module.exports = roleModel;