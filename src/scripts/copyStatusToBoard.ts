import { BlockType, getBlockModel, IBlockDocument } from "../mongo/block";
import { getDefaultConnection } from "../mongo/defaultConnection";

export async function copyStatusToBoard() {
  console.log(`script - copyStatusToBoard - started`);

  let docsCount = 0;
  const blockModel = getBlockModel(getDefaultConnection().getConnection());
  await blockModel.model.ensureIndexes();
  const cursor = blockModel.model.find({ type: BlockType.Org }).cursor();

  try {
    for (
      let doc: IBlockDocument = await cursor.next();
      doc !== null;
      doc = await cursor.next()
    ) {
      await blockModel.model
        .updateMany(
          { type: BlockType.Board, parent: doc.customId },
          { boardStatuses: doc.boardStatuses }
        )
        .exec();

      docsCount++;
    }

    cursor.close();
    console.log(`block(s) count = ${docsCount}`);
    console.log(`script - copyStatusToBoard - completed`);
  } catch (error) {
    console.log(`script - copyStatusToBoard - error`);
    console.log("- - - - -");
    console.error(error);
    console.log("- - - - -");
  }
}
