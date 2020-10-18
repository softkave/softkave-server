import { SprintDuration } from "../../mongo/sprint";

export const sprintConstants = {
    durationOptions: [
        SprintDuration.OneWeek,
        SprintDuration.TwoWeeks,
        SprintDuration.OneMonth,
    ],
    maxNameLength: 100,
};
