import pick from "lodash/pick";
import {
  blockTaskCollaboratorDataSchema,
  IBlockDocument
} from "../mongo/block";
import BlockModel from "../mongo/block/BlockModel";
import connection from "../mongo/defaultConnection";

const taskCollaboratorFields = Object.keys(blockTaskCollaboratorDataSchema);

export default async function taskCollaborationDataScript() {
  // convert taskCollaborationType to taskCollaborationData
  // move completedAt from taskCollaborators to taskCollaborationData
  // clear taskCollaborationType

  console.log(`script - ${__filename} - started`);

  const blockModel = new BlockModel({ connection: connection.getConnection() });

  await blockModel.model.ensureIndexes();
  const cursor = blockModel.model.find({ type: "task" }).cursor();
  let docsCount = 0;

  try {
    for (
      let doc: IBlockDocument = await cursor.next();
      doc !== null;
      doc = await cursor.next()
    ) {
      const update: any = {};
      update.taskCollaborationData = {
        // @ts-ignore
        ...doc.taskCollaborationType,
        collaborationType: "collective"
      };

      const hasCollaborators =
        Array.isArray(doc.taskCollaborators) &&
        doc.taskCollaborators.length > 0;

      if (hasCollaborators) {
        const collaborators = doc.taskCollaborators;
        collaborators.sort(
          (collaborator1, collaborator2) =>
            Number(collaborator1.completedAt || 0) -
            Number(collaborator2.completedAt || 0)
        );

        update.taskCollaborationData.completedAt = collaborators[0].completedAt;
        update.taskCollaborationData.completedBy = collaborators[0].userId;
        update.taskCollaborators = collaborators.map(collaborator => ({
          ...pick(collaborator, taskCollaboratorFields)
          // completedAt: null
        }));
      }

      await blockModel.model
        .updateOne({ customId: doc.customId }, update)
        .exec();
      docsCount++;
    }

    await blockModel.model
      .updateMany({ type: "task" }, { $unset: { taskCollaborationType: "" } })
      .exec();

    console.log(`updated ${docsCount} doc(s)`);
    console.log(`script - ${__filename} - completed`);
  } catch (error) {
    console.log(`script - ${__filename} - error`);
    console.log("- - - - -");
    console.error(error);
    console.log("- - - - -");
  }
}
