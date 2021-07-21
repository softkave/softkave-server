import { fireAndForganizationetPromise } from "../endpoints/utils";
import {
    BlockType,
    getBlockModel,
    IBlock,
    IBlockDocument,
    IBlockLabel,
    IBlockStatus,
    IBoardStatusResolution,
} from "../mongo/block";
import { getDate } from "../utilities/fns";
import {
    logScriptFailed,
    logScriptStarted,
    logScriptSuccessful,
} from "./utils";

export async function script_cleanupDeletedLabelsAndStatusInTasks() {
    logScriptStarted(script_cleanupDeletedLabelsAndStatusInTasks);

    const blockModel = getBlockModel();

    await blockModel.waitTillReady();

    // This approach is not suitable when there's a lot of data,
    // the system can quickly run out of memory
    const boardsMap: Record<string, IBlock> = {};
    const statusMap: Record<string, IBlockStatus> = {};
    const labelsMap: Record<string, IBlockLabel> = {};
    const resolutionsMap: Record<string, IBoardStatusResolution> = {};

    const cursor = blockModel.model.find({ type: BlockType.Task }).cursor();
    let updatedCount = 0;
    let deletedTasksCount = 0;

    try {
        for (
            let doc: IBlockDocument = await cursor.next();
            doc !== null;
            doc = await cursor.next()
        ) {
            if (
                !doc.status ||
                !doc.labels ||
                doc.labels.length === 0 ||
                !doc.taskResolution
            ) {
                continue;
            }

            if (!doc.parent) {
                deletedTasksCount++;
                fireAndForganizationetPromise(doc.remove());
                continue;
            }

            let board = boardsMap[doc.parent!];

            if (!board) {
                board = await blockModel.model
                    .findOne({ customId: doc.parent! })
                    .lean()
                    .exec();
            }

            if (!board) {
                fireAndForganizationetPromise(doc.remove());
                continue;
            }

            let changed = false;

            // update status
            if (doc.status) {
                if (!doc.statusAssignedBy) {
                    doc.statusAssignedBy = doc.createdBy;
                    doc.statusAssignedAt = getDate();
                    changed = true;
                }

                if (!doc.statusAssignedAt) {
                    doc.statusAssignedAt = getDate();
                    changed = true;
                }

                let status = statusMap[doc.status];

                if (!status) {
                    const boardStatuses = board.boardStatuses || [];
                    status = boardStatuses.find(
                        (status) => status.customId === doc.status
                    );

                    if (status) {
                        statusMap[status.customId] = status;
                    } else {
                        doc.status = null;
                        doc.statusAssignedAt = null;
                        doc.statusAssignedBy = null;
                        changed = true;
                    }
                }
            }

            // update labels
            if (doc.labels && doc.labels.length > 0) {
                const updateIdx: number[] = [];
                const removeIdx: number[] = [];

                doc.labels.forEach((docAssignedLabel, i) => {
                    let label = labelsMap[docAssignedLabel.customId];

                    if (!label) {
                        const boardLabels = board.boardLabels || [];
                        label = boardLabels.find(
                            (label) =>
                                label.customId === docAssignedLabel.customId
                        );

                        if (label) {
                            labelsMap[label.customId] = label;
                        } else {
                            removeIdx.push(i);
                            return;
                        }
                    }

                    if (
                        !docAssignedLabel.assignedBy ||
                        !docAssignedLabel.assignedAt
                    ) {
                        updateIdx.push(i);
                    }
                });

                if (updateIdx.length > 0) {
                    updateIdx.forEach((i) => {
                        if (!doc.labels[i].assignedBy) {
                            doc.labels[i].assignedBy = doc.createdBy;
                            doc.labels[i].assignedAt = getDate();
                        }

                        if (!doc.labels[i].assignedAt) {
                            doc.labels[i].assignedAt = getDate();
                        }
                    });
                }

                if (removeIdx.length > 0) {
                    removeIdx.forEach((i) => {
                        doc.labels.splice(i, 1);
                    });
                }

                if (updateIdx.length > 0 || removeIdx.length > 0) {
                    doc.markModified("labels");
                    changed = true;
                }
            }

            // update resolution
            if (doc.taskResolution) {
                let resolution = resolutionsMap[doc.taskResolution];

                if (!resolution) {
                    const boardResolutions = board.boardResolutions || [];
                    resolution = boardResolutions.find(
                        (resolution) =>
                            resolution.customId === doc.taskResolution
                    );

                    if (resolution) {
                        resolutionsMap[resolution.customId] = resolution;
                    } else {
                        doc.taskResolution = null;
                        changed = true;
                    }
                }
            }

            if (changed) {
                updatedCount++;
                fireAndForganizationetPromise(doc.save());
            }
        }

        cursor.close();
        console.log(`updated task(s) count = ${updatedCount}`);
        console.log(`deleted task(s) count = ${deletedTasksCount}`);
        logScriptSuccessful(script_cleanupDeletedLabelsAndStatusInTasks);
    } catch (error) {
        logScriptFailed(script_cleanupDeletedLabelsAndStatusInTasks, error);
    }
}
