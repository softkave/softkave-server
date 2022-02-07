import { BlockPriority } from "../../mongo/block";

const taskConstants = {
    maxNameLength: 300,
    maxDescriptionLength: 1000,
    maxTaskCollaboratorsLength: 20,
    priorityValuesArray: [
        BlockPriority.High,
        BlockPriority.Low,
        BlockPriority.Medium,
    ],
    maxSubTasks: 50,
    maxAssignedLabels: 20,
};

export { taskConstants };
