import { getComplexTypeArrayInputGraphQLSchema } from "../utils";

const taskSchema = `
    type Assignee {
        userId: String
        assignedBy: String
        assignedAt: String
    }

    input AssigneeInput {
        userId: String
    }

    type SubTask {
        customId: String
        description: String
        createdAt: String
        createdBy: String
        updatedAt: String
        updatedBy: String
        completedBy: String
        completedAt: String
    }

    input SubTaskInput {
        customId: String
        description: String
        completedBy: String
    }

    type BlockAssignedLabel {
        customId: String
        assignedBy: String
        assignedAt: String
    }

    input BlockAssignedLabelInput {
        customId: String
    }

    type TaskSprint {
        sprintId: String
        assignedAt: String
        assignedBy: String
    }

    type Task {
        customId: String
        createdBy: String
        createdAt: String
        type: String
        name: String
        description: String
        dueAt: String
        updatedAt: String
        updatedBy: String
        parent: String
        rootBlockId: String
        assignees: [Assignee]
        priority: String
        subTasks: [SubTask]
        status: String
        statusAssignedBy: String
        statusAssignedAt: String
        taskResolution: String
        labels: [BlockAssignedLabel]
        taskSprint: TaskSprint
    }

    type SingleTaskOpResponse {
        errors: [Error]
        task: Task
    }

    type MultipleTasksOpResponse {
        errors: [Error]
        tasks: [Task]
    }

    input TaskSprintInput {
        sprintId: String
    }

    input CreateTaskInput {
        name: String
        description: String
        dueAt: String
        parent: String
        rootBlockId: String
        assignees: [AssigneeInput]
        priority: String
        subTasks: [SubTaskInput]
        status: String
        taskResolution: String
        labels: [BlockAssignedLabelInput]
        taskSprint: TaskSprintInput
    }

    ${getComplexTypeArrayInputGraphQLSchema(
        "UpdateBlockSubTaskInput",
        "SubTaskInput"
    )}
    ${getComplexTypeArrayInputGraphQLSchema(
        "UpdateBlockAssigneeInput",
        "AssigneeInput"
    )}
    ${getComplexTypeArrayInputGraphQLSchema(
        "UpdateBlockBlockAssignedLabelInput",
        "BlockAssignedLabelInput"
    )}

    input UpdateTaskInput {
        name: String
        description: String
        priority: String
        parent: String
        subTasks: UpdateBlockSubTaskInput
        dueAt: String
        assignees: UpdateBlockAssigneeInput
        status: String
        taskResolution: String
        labels: UpdateBlockBlockAssignedLabelInput
        taskSprint: TaskSprintInput
    }

    type TaskQuery {
        getBoardTasks (boardId: String!) : MultipleTasksOpResponse
    }

    type TaskMutation {
        createTask (task: CreateTaskInput!) : SingleTaskOpResponse
        updateTask (taskId: String!, data: UpdateTaskInput!) : SingleTaskOpResponse
        transferTask (taskId: String!, boardId: String!) : SingleTaskOpResponse
        deleteTask (taskId: String!) : ErrorOnlyResponse
    }
`;

export default taskSchema;
