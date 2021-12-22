import { BlockType, getBlockModel, IBlockDocument } from "../mongo/block";
import {
    logScriptFailed,
    logScriptStarted,
    logScriptSuccessful,
} from "./utils";

// Move the task description to name for tasks without names
export async function script_taskNameUpdates() {
    logScriptStarted(script_taskNameUpdates);
    const blockModel = getBlockModel();
    await blockModel.waitTillReady();
    const cursor = blockModel.model.find({ type: BlockType.Task }).cursor();
    let docsCount = 0;

    try {
        for (
            let doc: IBlockDocument = await cursor.next();
            doc !== null;
            doc = await cursor.next()
        ) {
            if (doc.name) {
                continue;
            }

            doc.name = doc.description;
            doc.description = null;
            doc.save().catch(console.error);
        }

        cursor.close();
        console.log(`task(s) count = ${docsCount}`);
        logScriptSuccessful(script_taskNameUpdates);
    } catch (error) {
        logScriptFailed(script_taskNameUpdates, error);
    }
}
