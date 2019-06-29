const priorityNotImportant = "not important";
const priorityImportant = "important";
const priorityVeryImportant = "very important";

const groupTaskContext = "groupTaskContext";
const groupProjectContext = "groupProjectContext";

const blockTypeGroup = "group";
const blockTypeOrg = "org";
const blockTypeProject = "project";
const blockTypeRoot = "root";
const blockTypeTask = "task";

const constants = {
  minNameLength: 0,
  maxNameLength: 300,
  minDescriptionLength: 0,
  maxDescriptionLength: 1000,
  maxParentsLength: 10,
  minRequiredStringLength: 1,
  minTaskCollaboratorsLength: 0,
  maxTaskCollaboratorsLength: 10,
  minAddCollaboratorBodyMessageLength: 0,
  maxAddCollaboratorBodyMessageLength: 500,
  minAddCollaboratorValuesLength: 0,
  maxAddCollaboratorValuesLength: 10,
  maxChildrenCount: 100,
  blockTypesArray: [
    blockTypeGroup,
    blockTypeOrg,
    blockTypeProject,
    blockTypeTask,
    blockTypeRoot
  ],
  priorityValuesArray: [
    priorityNotImportant,
    priorityImportant,
    priorityVeryImportant
  ],
  priorityTypes: {
    [priorityImportant]: priorityImportant,
    [priorityNotImportant]: priorityNotImportant,
    [priorityVeryImportant]: priorityVeryImportant
  },
  groupContextsArray: [groupTaskContext, groupProjectContext],
  groupContexts: {
    groupTaskContext,
    groupProjectContext
  },
  blockTypes: {
    [blockTypeGroup]: blockTypeGroup,
    [blockTypeOrg]: blockTypeOrg,
    [blockTypeProject]: blockTypeProject,
    [blockTypeRoot]: blockTypeRoot,
    [blockTypeTask]: blockTypeTask
  }
};

const blockTaskCollaboratorFieldNames = {
  userId: "userId",
  completedAt: "completedAt",
  assignedAt: "assignedAt",
  assignedBy: "assignedBy"
};

const blockFieldNames = {
  customId: "customId",
  name: "name",
  description: "description",
  expectedEndAt: "expectedEndAt",
  createdAt: "createdAt",
  color: "color",
  updatedAt: "updatedAt",
  type: "type",
  parents: "parents",
  createdBy: "createdBy",
  taskCollaborators: "taskCollaborators",
  priority: "priority",
  position: "position",
  positionTimestamp: "positionTimestamp",
  groups: "groups",
  projects: "projects",
  tasks: "tasks",
  groupTaskContext: "groupTaskContext",
  groupProjectContext: "groupProjectContext"
};

module.exports = {
  constants,
  blockFieldNames,
  blockTaskCollaboratorFieldNames
};
