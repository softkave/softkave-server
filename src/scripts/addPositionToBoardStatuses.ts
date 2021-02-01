import { BlockType, getBlockModel, IBlockDocument } from "../mongo/block";
import {
    logScriptFailed,
    logScriptStarted,
    logScriptSuccessful,
} from "./utils";

export async function script_addPositionToBoardStatuses() {
    logScriptStarted(script_addPositionToBoardStatuses);

    const blockModel = getBlockModel();
    await blockModel.waitTillReady();
    const cursor = blockModel.model.find({ type: BlockType.Board }).cursor();

    try {
        for (
            let doc: IBlockDocument = await cursor.next();
            doc !== null;
            doc = await cursor.next()
        ) {
            if (!doc.boardStatuses) {
                return;
            }

            const statuses = doc.boardStatuses.map((status, index) => ({
                customId: status.customId,
                name: status.name,
                color: status.color,
                createdBy: status.createdBy,
                createdAt: status.createdAt,
                description: status.description,
                updatedBy: status.updatedBy,
                updatedAt: status.updatedAt,
                position: index,
            }));

            await blockModel.model.updateOne(
                { customId: doc.customId },
                { boardStatuses: statuses }
            );
        }

        cursor.close();
        logScriptSuccessful(script_addPositionToBoardStatuses);
    } catch (error) {
        logScriptFailed(script_addPositionToBoardStatuses, error);
    }
}
