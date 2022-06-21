import { IBlockLabel } from "../../../mongo/block";
import { indexArray } from "../../../utilities/fns";
import RequestData from "../../RequestData";
import { fireAndForgetPromise } from "../../utils";
import { IBoard } from "../types";
import { IUpdateBoardContext, IUpdateBoardParameters } from "./types";

function getLabelChangedFields(
    label1: IBlockLabel,
    label2: IBlockLabel
): Array<keyof IBlockLabel> {
    return ["color", "description", "name"].reduce((accumulator, field) => {
        if (label1[field] !== label2[field]) {
            accumulator.push(field);
        }

        return accumulator;
    }, []);
}

async function persistBoardLabelChanges(
    context: IUpdateBoardContext,
    instData: RequestData<IUpdateBoardParameters>,
    board: IBoard,
    data: Partial<IBoard>
) {
    const boardLabels = data.boardLabels;

    if (!boardLabels) {
        return;
    }

    const oldBoardLabels = board.boardLabels || [];
    const indexedOldBoardLabels = indexArray(oldBoardLabels, {
        path: "customId",
    });

    const indexedNewBoardLabels = indexArray(boardLabels, {
        path: "customId",
    });

    const deletedLabelIds: string[] = [];

    oldBoardLabels.forEach((label) => {
        if (!indexedNewBoardLabels[label.customId]) {
            deletedLabelIds.push(label.customId);
        }
    });

    boardLabels.forEach((label) => {
        const existingLabel = indexedOldBoardLabels[label.customId];

        if (!existingLabel) {
            return;
        }

        if (existingLabel.updatedAt !== label.updatedAt) {
            const changedFields = getLabelChangedFields(existingLabel, label);
            const newValue: any = {};
            const oldValue: any = {};

            if (changedFields.length === 0) {
                return;
            }

            changedFields.forEach((field) => {
                oldValue[field] = existingLabel[field];
                newValue[field] = label[field];
            });
        }
    });

    if (deletedLabelIds.length === 0) {
        return;
    }

    // TODO: how should we handle if this fails?
    // if it fails, the task will contain labels that have been deleted, maybe change in client-side
    // TODO: maybe wite a cron job to clean things up
    fireAndForgetPromise(
        context.bulkRemoveDeletedLabelsInTasks(
            context,
            board.customId,
            deletedLabelIds
        )
    );
}

export default persistBoardLabelChanges;
