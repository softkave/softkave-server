import { ISprint } from "../../mongo/sprint";
import getSingletonFunc from "../../utilities/createSingletonFunc";
import { indexArray } from "../../utilities/fns";
import getNewId from "../../utilities/getNewId";
import { IUpdateItemById } from "../../utilities/types";
import { IBaseContext } from "../contexts/BaseContext";
import { ISprintContext } from "../contexts/SprintContext";

let sprints: ISprint[] = [];

class TestSprintContext implements ISprintContext {
    public getSprintById = async (ctx: IBaseContext, customId: string) => {
        return sprints.find((sprint) => sprint.customId === customId);
    };

    public getMany = async (ctx: IBaseContext, ids: string[]) => {
        const idsMap = indexArray(ids);
        return sprints.filter((sprint) => idsMap[sprint.customId]);
    };

    public updateSprintById = async (
        ctx: IBaseContext,
        customId: string,
        data: Partial<ISprint>
    ) => {
        const index = sprints.findIndex(
            (sprint) => sprint.customId === customId
        );

        if (index !== -1) {
            sprints[index] = { ...sprints[index], ...data };
            return sprints[index];
        }
    };

    public bulkUpdateSprintsById = async (
        ctx: IBaseContext,
        data: Array<IUpdateItemById<ISprint>>
    ) => {
        const updatesMap = indexArray(data, { path: "id" });
        sprints.forEach((sprint, i) => {
            if (updatesMap[sprint.customId]) {
                sprints[i] = {
                    ...sprint,
                    ...updatesMap[sprint.customId].data,
                };
            }
        });
    };

    public getSprintsByBoardId = async (ctx: IBaseContext, boardId: string) => {
        return sprints.filter((sprint) => sprint.boardId === boardId);
    };

    public sprintExists = async (
        ctx: IBaseContext,
        name: string,
        boardId: string
    ) => {
        name = name.toLowerCase();
        return !!sprints.find(
            (sprint) => sprint.name === name && sprint.boardId === boardId
        );
    };

    public deleteSprint = async (ctx: IBaseContext, sprintId: string) => {
        const index = sprints.findIndex(
            (sprint) => sprint.customId === sprintId
        );

        if (index !== -1) {
            sprints.splice(index, 1);
        }
    };

    public updateUnstartedSprints = async (
        ctx: IBaseContext,
        boardId: string,
        data: Partial<ISprint>
    ) => {
        sprints.forEach((sprint, i) => {
            if (sprint.boardId === boardId && !sprint.startDate) {
                sprints[i] = { ...sprint, ...data };
            }
        });
    };

    public async saveSprint(
        ctx: IBaseContext,
        sprint: Omit<ISprint, "customId">
    ) {
        sprints.push({
            ...sprint,
            customId: getNewId(),
        });

        return sprints[sprints.length - 1];
    }

    public deleteSprintByBoardId = async (
        ctx: IBaseContext,
        boardId: string
    ) => {
        sprints = sprints.filter((sprint) => {
            return sprint.boardId !== boardId;
        });
    };
}

export const getTestSprintContext = getSingletonFunc(
    () => new TestSprintContext()
);
