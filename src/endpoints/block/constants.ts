const priorityNotImportant = "not important";
const priorityImportant = "important";
const priorityVeryImportant = "very important";

const blockConstants = {
    maxNameLength: 300,
    maxDescriptionLength: 1000,
    minRequiredStringLength: 1,
    maxTaskCollaboratorsLength: 10,
    maxAddCollaboratorValuesLength: 10,
    maxChildrenCount: 500,
    blockTypesCount: 4,
    priorityValuesArray: [
        priorityNotImportant,
        priorityImportant,
        priorityVeryImportant,
    ],
    maxSubTasks: 50,
    minLabelNameLength: 1,
    maxLabelNameLength: 70,
    maxLabelDescriptionLength: 300,
    maxLabels: 20,
    maxStatuses: 20,
    maxResolutions: 20,
    maxAssignedLabels: 20,
    maxCollaborators: 1000,
};

export { blockConstants };
