import { ISprint } from "../../../mongo/sprint";
import makeSingletonFn from "../../../utilities/createSingletonFunc";
import { indexArray } from "../../../utilities/fns";
import getNewId from "../../../utilities/getNewId";
import { IUpdateItemById } from "../../../utilities/types";
import { IBaseContext } from "../../contexts/IBaseContext";
import { ISprintContext } from "../../contexts/SprintContext";

class TestSprintContext implements ISprintContext {
    sprints: ISprint[] = [];

    public getSprintById = async (ctx: IBaseContext, customId: string) => {
        return this.sprints.find((sprint) => sprint.customId === customId);
    };

    public getMany = async (ctx: IBaseContext, ids: string[]) => {
        const idsMap = indexArray(ids);
        return this.sprints.filter((sprint) => idsMap[sprint.customId]);
    };

    public updateSprintById = async (
        ctx: IBaseContext,
        customId: string,
        data: Partial<ISprint>
    ) => {
        const index = this.sprints.findIndex(
            (sprint) => sprint.customId === customId
        );

        if (index !== -1) {
            this.sprints[index] = { ...this.sprints[index], ...data };
            return this.sprints[index];
        }
    };

    public bulkUpdateSprintsById = async (
        ctx: IBaseContext,
        data: Array<IUpdateItemById<ISprint>>
    ) => {
        const updatesMap = indexArray(data, { path: "id" });
        this.sprints.forEach((sprint, i) => {
            if (updatesMap[sprint.customId]) {
                this.sprints[i] = {
                    ...sprint,
                    ...updatesMap[sprint.customId].data,
                };
            }
        });
    };

    public getSprintsByBoardId = async (ctx: IBaseContext, boardId: string) => {
        return this.sprints.filter((sprint) => sprint.boardId === boardId);
    };

    public sprintExists = async (
        ctx: IBaseContext,
        name: string,
        boardId: string
    ) => {
        name = name.toLowerCase();
        return !!this.sprints.find(
            (sprint) => sprint.name === name && sprint.boardId === boardId
        );
    };

    public deleteSprint = async (ctx: IBaseContext, sprintId: string) => {
        const index = this.sprints.findIndex(
            (sprint) => sprint.customId === sprintId
        );

        if (index !== -1) {
            this.sprints.splice(index, 1);
        }
    };

    public updateUnstartedSprints = async (
        ctx: IBaseContext,
        boardId: string,
        data: Partial<ISprint>
    ) => {
        this.sprints.forEach((sprint, i) => {
            if (sprint.boardId === boardId && !sprint.startDate) {
                this.sprints[i] = { ...sprint, ...data };
            }
        });
    };

    public async saveSprint(
        ctx: IBaseContext,
        sprint: Omit<ISprint, "customId">
    ) {
        this.sprints.push({
            ...sprint,
            customId: getNewId(),
        });

        return this.sprints[this.sprints.length - 1];
    }

    public deleteSprintByBoardId = async (
        ctx: IBaseContext,
        boardId: string
    ) => {
        this.sprints = this.sprints.filter((sprint) => {
            return sprint.boardId !== boardId;
        });
    };
}

export const getTestSprintContext = makeSingletonFn(
    () => new TestSprintContext()
);
