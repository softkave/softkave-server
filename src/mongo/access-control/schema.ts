const accessControlSchema = {
  orgId: { type: String, unique: true },
  actionName: { type: String, index: true },
  permittedRoles: { type: [String], index: true }
};

export default accessControlSchema;
