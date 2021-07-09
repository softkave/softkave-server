const priorityNotImportant = "not important";
const priorityImportant = "important";
const priorityVeryImportant = "very important";

const taskConstants = {
    maxNameLength: 300,
    maxDescriptionLength: 1000,
    maxTaskCollaboratorsLength: 10,
    maxChildrenCount: 500,
    priorityValuesArray: [
        priorityNotImportant,
        priorityImportant,
        priorityVeryImportant,
    ],
    maxSubTasks: 50,
    maxLabels: 20,
    maxAssignedLabels: 20,
};

export { taskConstants };
