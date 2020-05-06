import { IBlockDocument } from "../mongo/block";
import BlockModel from "../mongo/block/BlockModel";
import connection from "../mongo/defaultConnection";

export default async function addStatusToTasksWithoutOne() {
  // Adds status to tasks that don't have one yet
  console.log(`script - ${__filename} - started`);

  const cachedOrgs: { [key: string]: IBlockDocument } = {};
  const blockModel = new BlockModel({ connection: connection.getConnection() });

  await blockModel.model.ensureIndexes();

  const cursor = blockModel.model
    .find({
      type: "task",
      // status: { $in: [null, undefined] }
    })
    // .find({ type: "task" })
    .cursor();

  let docsCount = 0;

  try {
    for (
      let doc: IBlockDocument = await cursor.next();
      doc !== null;
      doc = await cursor.next()
    ) {
      let org = cachedOrgs[doc.rootBlockID];

      if (!org) {
        org = await blockModel.model
          .findOne({ customId: doc.rootBlockID })
          .exec();

        cachedOrgs[org.customId] = org;
      }

      if (!doc.status) {
        const availableStatus = org.availableStatus || [];
        const status0 = (org.availableStatus || [])[0];
        const lastStatus = availableStatus[availableStatus.length - 1];

        if (status0) {
          if (doc.taskCollaborationData?.completedAt >= 0) {
            doc.status = lastStatus.customId;
          } else {
            doc.status = status0.customId;
          }
        }
      }

      // const status0 = (org.availableStatus || [])[0];

      // if (status0) {
      //   doc.status = status0.customId;
      // }

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
