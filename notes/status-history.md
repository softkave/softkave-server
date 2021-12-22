# Status History

We are trying to keep the status history of task so that we can surface stats from them, like the average time to complete a task, the longest, the shortest, who's completed more tasks, etc. To do this, I think we'd need a data structure that can store different kinds of actions performed on a task. This will not capture the entire history but just interesting actions like the time a task was created, deleted, or the status was updated. Maybe in the future, we'd design a feature-complete audit log system.

## Some considerations

1. When we change the last status that marks a task completed, should we prompt the user to automatically migrate completed tasks to the new status?

## What information do we want to surface

1. Average time to complete a task
2. Querying tasks using total time spent
3. Average time a task spends in a status
4. How long a task has been open and how long since it was closed
5. Sort tasks by how long they've been created
6. Email notification on complete task

### Average time to complete tasks

For this, we will capture history data like when when a task's status was updated for now. We will compute this on request, using the task history data collected. We will batch fetch history items, compute and continue until we exhaust the items. This is not a scalable implementation, so in the future, we should find a better way.

```typescript
// We'd define actions here to avoid collision
enum TaskHistoryAction {
    StatusUpdated,
}

interface ITaskHistoryItem {
    customId: string;
    organizationId: string;
    boardId: string;
    taskId: string;
    action: TaskHistoryAction;

    // Present for some actions like:
    // 1. status-updated - value will be the status ID
    value?: string;
    createdAt: string; // Date
    createdBy: string;

    // Difference between this update and the previous (related) history item
    // For example, we'd use it to capture how long it took to move a task from one stage to the other
    // Time in milliseconds
    timeToStage: number;

    // How long has been spent on this task to this stage
    // Time in milliseconds
    timeSpentSoFar: number;
}

export interface ITaskHistoryItemContextFnQuery {
    boardId?: string;
    taskId?: string;
    action?: TaskHistoryAction;
    value?: string;
}

export interface ITaskHistoryContext {
    insert: (
        ctx: IBaseContext,
        item: ITaskHistoryItem
    ) => Promise<ITaskHistoryItem>;
    getMany: (
        ctx: IBaseContext,
        query: ITaskHistoryItemContextFnQuery,
        from?: string | null,
        to?: string | null,
        limit?: number | null
    ) => Promise<ITaskHistoryItem[]>;
    deleteTaskHistoryItems: (
        ctx: IBaseContext,
        query: ITaskHistoryItemContextFnQuery
    ) => Promise<void>;
}

// Update to /block endpoints
interface IBlockEndpoints {
    getAverageTimeSpentOnTasks: () => Promise<number>;
}
```
