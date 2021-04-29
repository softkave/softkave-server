import { IBoardSprintOptions, ISprint } from "../../mongo/sprint";
import { getDateString } from "../../utilities/fns";
import { extractFields, getFields } from "../utils";
import { IPublicSprint, IPublicSprintOptions } from "./types";

const publicSprintFields = getFields<IPublicSprint>({
    customId: true,
    boardId: true,
    orgId: true,
    duration: true,
    createdAt: getDateString,
    createdBy: true,
    name: true,
    sprintIndex: true,
    prevSprintId: true,
    nextSprintId: true,
    startDate: getDateString,
    startedBy: true,
    endDate: getDateString,
    endedBy: true,
    updatedAt: getDateString,
    updatedBy: true,
});

const sprintOptionsFields = getFields<IPublicSprintOptions>({
    duration: true,
    updatedAt: true,
    updatedBy: true,
    createdAt: true,
    createdBy: true,
});

export function getPublicSprintData(sprint: ISprint): IPublicSprint {
    return extractFields(sprint, publicSprintFields);
}

export function getPublicSprintArray(sprints: ISprint[]): IPublicSprint[] {
    return sprints.map((sprint) => extractFields(sprint, publicSprintFields));
}

export function getPublicSprintOptions(
    sprintOption: IBoardSprintOptions
): IPublicSprintOptions {
    return extractFields(sprintOption, sprintOptionsFields);
}
