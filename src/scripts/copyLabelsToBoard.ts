import { BlockType, getBlockModel, IBlockDocument } from "../mongo/block";
import { getDefaultConnection } from "../mongo/defaultConnection";

export async function copyLabelsToBoard() {
  console.log(`script - copyLabelsToBoard - started`);

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
          { boardLabels: doc.boardLabels }
        )
        .exec();

      docsCount++;
    }

    cursor.close();
    console.log(`block(s) count = ${docsCount}`);
    console.log(`script - copyLabelsToBoard - completed`);
  } catch (error) {
    console.log(`script - copyLabelsToBoard - error`);
    console.log("- - - - -");
    console.error(error);
    console.log("- - - - -");
  }
}
