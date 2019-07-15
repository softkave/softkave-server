const blockTaskCollaboratorsDataSchema = {
  userId: String,
  completedAt: Number,
  assignedAt: Number,
  assignedBy: String
};

const blockRoleSchema = {
  roleName: String,
  createdBy: String,
  createdAt: String
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
    type: [String],
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
  isBacklog: Boolean,
  position: Number,
  positionTimestamp: Number,
  tasks: [String],
  groups: [String],
  projects: [String],
  groupTaskContext: [String],
  groupProjectContext: [String],
  roles: [blockRoleSchema]
};

export default blockSchema;
export { blockTaskCollaboratorsDataSchema };
