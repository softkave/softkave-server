import { IBlockDocument } from "../mongo/block";
import BlockModel from "../mongo/block/BlockModel";
import connection from "../mongo/defaultConnection";

export default async function deprecateGroups() {
  // Change the parent of block's with a group as parent to the group's parent
  console.log(`script - ${__filename} - started`);

  const blockModel = new BlockModel({ connection: connection.getConnection() });

  await blockModel.model.ensureIndexes();

  const cursor = blockModel.model
    .find({
      type: "group",
    })
    .cursor();

  let docsCount = 0;

  try {
    for (
      let doc: IBlockDocument = await cursor.next();
      doc !== null;
      doc = await cursor.next()
    ) {
      await blockModel.model
        .updateMany(
          {
            parent: doc.customId,
          },
          {
            parent: doc.parent,
          }
        )
        .exec();

      await doc.save();
      docsCount++;
    }

    console.log(`iterated through ${docsCount} groups(s)`);
    console.log(`script - ${__filename} - completed`);
  } catch (error) {
    console.log(`script - ${__filename} - error`);
    console.log("- - - - -");
    console.error(error);
    console.log("- - - - -");
  }
}
