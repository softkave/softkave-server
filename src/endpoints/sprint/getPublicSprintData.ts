import { ISprint } from "../../mongo/sprint";

export default function getPublicSprintData(sprint: ISprint): ISprint {
    return {
        customId: sprint.customId,
        boardId: sprint.boardId,
        orgId: sprint.orgId,
        duration: sprint.duration,
        sprintIndex: sprint.sprintIndex,
        createdAt: sprint.createdAt,
        createdBy: sprint.createdBy,
        name: sprint.name,
        startDate: sprint.startDate,
        startedBy: sprint.startedBy,
        endDate: sprint.endDate,
        endedBy: sprint.endedBy,
        updatedAt: sprint.updatedAt,
        updatedBy: sprint.updatedBy,
    };
}
