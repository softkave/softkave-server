const MongoModel = require("./MongoModel");

const blockTaskCollaboratorsDataSchema = {
  userId: String,
  completedAt: Number,
  assignedAt: Number,
  assignedBy: String
};

const blockSchema = {
  customId: { type: String, unique: true },
  name: {
    type: String,
    index: true
  },
  description: String,
  expectedEndAt: Number,
  createdAt: {
    type: Number,
    default: Date.now
  },
  color: String,
  updatedAt: Number,
  type: {
    type: String,
    index: true
  },
  parents: {
    type: [
      {
        type: String
      }
    ],
    index: true
  },
  createdBy: {
    type: String,
    index: true
  },
  taskCollaborators: {
    type: [blockTaskCollaboratorsDataSchema],
    index: true
  },
  priority: String,
  position: Number,
  positionTimestamp: Number,
  tasks: [String],
  groups: [String],
  projects: [String],
  groupTaskContext: [String],
  groupProjectContext: [String]
};

const modelName = "block";
const collectionName = "blocks";

class BlockModel extends MongoModel {
  constructor({ connection }) {
    super({
      connection,
      modelName,
      collectionName,
      rawSchema: blockSchema
    });
  }
}

module.exports = BlockModel;
