import { IBlockDocument } from "../mongo/block";
import BlockModel from "../mongo/block/BlockModel";
import connection from "../mongo/defaultConnection";

export default async function addBoardIdToBlocks() {
  // Adds boardId (the org or project the block is in) to blocks
  console.log(`script - ${__filename} - started`);

  const cachedBlocks: { [key: string]: IBlockDocument } = {};
  const blockModel = new BlockModel({ connection: connection.getConnection() });

  await blockModel.model.ensureIndexes();

  const getParent = async (id: string) => {
    let parent = cachedBlocks[id];

    if (!parent) {
      parent = await blockModel.model.findOne({ customId: id }).exec();

      if (!parent) {
        console.log("found a block without a parent");
        // TODO: should we write a script to delete blocks without parents?
      } else {
        cachedBlocks[parent.customId] = parent;
      }
    }

    return parent;
  };

  const cursor = blockModel.model.find({}).cursor();

  let docsCount = 0;

  try {
    for (
      let doc: IBlockDocument = await cursor.next();
      doc !== null;
      doc = await cursor.next()
    ) {
      if (doc.type === "org" || doc.type === "group") {
        cachedBlocks[doc.customId] = doc;

        if (doc.type === "group") {
          doc.boardId = doc.parent;
          await doc.save();
          docsCount++;
        }

        continue;
      }

      const parent = await getParent(doc.parent);

      if (!parent) {
        continue;
      }

      if (parent.type === "org" || parent.type === "project") {
        doc.boardId = parent.customId;
      } else {
        doc.boardId = parent.parent;
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
