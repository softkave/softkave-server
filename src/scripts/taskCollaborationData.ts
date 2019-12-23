import { IBlockDocument } from "../mongo/block";
import BlockModel from "../mongo/block/BlockModel";
import connection from "../mongo/defaultConnection";

export default async function taskCollaborationData() {
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
      // @ts-ignore
      doc.taskCollaborationData = doc.taskCollaborationType;

      // @ts-ignore
      doc.taskCollaborationType = null;
      const hasCollaborators =
        Array.isArray(doc.taskCollaborators) &&
        doc.taskCollaborators.length > 0;

      if (hasCollaborators) {
        const collaborators = doc.taskCollaborators || [];
        collaborators.sort(
          (collaborator1, collaborator2) =>
            Number(collaborator1.completedAt || 0) -
            Number(collaborator2.completedAt || 0)
        );

        doc.taskCollaborators = collaborators.map(collaborator => ({
          ...collaborator,
          completedAt: null
        }));

        doc.taskCollaborationData.completedAt = collaborators[0].completedAt;
        doc.taskCollaborationData.completedBy = collaborators[0].userId;
      } else {
        doc.taskCollaborators = [];
      }

      await doc.save();
      docsCount++;
    }

    console.log(`updated ${docsCount} doc(s)`);
    console.log(`script - ${__filename} - completed`);
  } catch (error) {
    console.log(`script - ${__filename} - error`);
    console.log("- - - - -");
    console.error(error);
    console.log("- - - - -");
  }
}
