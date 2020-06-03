import { BlockType } from "../../mongo/block";

const priorityNotImportant = "not important";
const priorityImportant = "important";
const priorityVeryImportant = "very important";

const groupTaskContext = "groupTaskContext";
const groupProjectContext = "groupProjectContext";

const blockTypeGroup = "group";
const blockTypeOrg = "org";
// const blockTypeProject = "project";
const blockTypeBoard = "board";
const blockTypeRoot = "root";
const blockTypeTask = "task";

const blockConstants = {
  minNameLength: 0,
  maxNameLength: 300,
  minDescriptionLength: 0,
  maxDescriptionLength: 1000,
  minRequiredStringLength: 1,
  minTaskCollaboratorsLength: 0,
  maxTaskCollaboratorsLength: 10,
  minAddCollaboratorValuesLength: 0,
  maxAddCollaboratorValuesLength: 10,
  maxChildrenCount: 500,
  blockTypesCount: 4,
  priorityValuesArray: [
    priorityNotImportant,
    priorityImportant,
    priorityVeryImportant,
  ],
  priorityTypes: {
    [priorityImportant]: priorityImportant,
    [priorityNotImportant]: priorityNotImportant,
    [priorityVeryImportant]: priorityVeryImportant,
  },
  groupContextsArray: [groupTaskContext, groupProjectContext],
  groupContexts: {
    groupTaskContext,
    groupProjectContext,
  },
  blockTypes: {
    [blockTypeGroup]: blockTypeGroup,
    [blockTypeOrg]: blockTypeOrg,
    [blockTypeBoard]: blockTypeBoard,
    [blockTypeRoot]: blockTypeRoot,
    [blockTypeTask]: blockTypeTask,
  },
  minLinkedBlockReasonLength: 0,
  maxLinkedBlockReasonLength: 250,
  minLinkedBlocksCount: 0,
  maxLinkedBlocksCount: 250,
  minRoleNameLength: 0,
  maxRoleNameLength: 100,
  minRoles: 1,
  maxRoles: 10,
  minSubTasksLength: 0,
  maxSubTasksLength: 50,
  taskCollaborationData: ["individual", "collective"],
  maxGetBlocksWithCustomIDs: 50,

  // label
  minLabelNameLength: 1,
  maxLabelNameLength: 70,
  minLabelDescriptionLength: 0,
  maxLabelDescriptionLength: 300,
  maxAvailableLabels: 20,
};

const labelConstants = {
  minNameLength: 0,
  maxNameLength: 0,
  minDescriptionLength: 0,
  maxDescriptionLength: 0,
  maxLabels: 0,
};

export { blockConstants };
