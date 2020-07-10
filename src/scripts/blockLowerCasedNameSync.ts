import { BlockType, getBlockModel, IBlockDocument } from "../mongo/block";
import { getDefaultConnection } from "../mongo/defaultConnection";

export async function blockLowerCasedNameSync() {
  console.log(`script - blockLowerCasedNameSync - started`);

  let docsCount = 0;
  const blockModel = getBlockModel(getDefaultConnection().getConnection());
  await blockModel.model.ensureIndexes();
  const cursor = blockModel.model
    .find({ type: { $in: [BlockType.Org, BlockType.Board] } })
    .cursor();

  try {
    for (
      let doc: IBlockDocument = await cursor.next();
      doc !== null;
      doc = await cursor.next()
    ) {
      await blockModel.model
        .updateMany(
          { customId: doc.customId },
          { lowerCasedName: doc.name.toLowerCase() }
        )
        .exec();

      docsCount++;
    }

    cursor.close();
    console.log(`block(s) count = ${docsCount}`);
    console.log(`script - blockLowerCasedNameSync - completed`);
  } catch (error) {
    console.log(`script - blockLowerCasedNameSync - error`);
    console.log("- - - - -");
    console.error(error);
    console.log("- - - - -");
  }
}
