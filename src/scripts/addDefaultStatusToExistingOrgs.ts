import uuid from "uuid/v4";
import { IBlockDocument } from "../mongo/block";
import BlockModel from "../mongo/block/BlockModel";
import connection from "../mongo/defaultConnection";

export default async function addDefaultStatusToExistingOrgs() {
  // Adds status to tasks that don't have one yet
  console.log(`script - ${__filename} - started`);

  const blockModel = new BlockModel({ connection: connection.getConnection() });

  await blockModel.model.ensureIndexes();

  const cursor = blockModel.model
    .find({ type: "org", createdAt: { $lte: Date.now() } })
    .cursor();

  let docsCount = 0;

  try {
    for (
      let doc: IBlockDocument = await cursor.next();
      doc !== null;
      doc = await cursor.next()
    ) {
      if (!doc.availableLabels || doc.availableLabels.length === 0) {
        doc.availableStatus = [
          {
            name: "Todo",
            description: "Ready tasks",
            createdAt: Date.now(),
            createdBy: "system",
            customId: uuid(),
          },
          {
            name: "In progress",
            description: "Currently being worked on",
            createdAt: Date.now(),
            createdBy: "system",
            customId: uuid(),
          },
          {
            name: "Pending review",
            description: "Completed, pending review",
            createdAt: Date.now(),
            createdBy: "system",
            customId: uuid(),
          },
          {
            name: "Done",
            description: "Completed, and reviewed",
            createdAt: Date.now(),
            createdBy: "system",
            customId: uuid(),
          },
        ];
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
