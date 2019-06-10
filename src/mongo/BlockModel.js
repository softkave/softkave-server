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
  description: {
    type: String
  },
  expectedEndAt: Number,
  createdAt: {
    type: Number,
    default: Date.now
  },
  color: {
    type: String
  },
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
  priority: {
    type: String
  },
  position: Number,
  positionTimestamp: Number
};

class BlockModel extends MongoModel {
  constructor({ connection }) {
    super({
      connection,
      rawSchema: blockSchema,
      modelName: "block",
      collectionName: "blocks"
    });
  }
}

module.exports = BlockModel;
