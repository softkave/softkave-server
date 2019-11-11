import { IBlockDocument } from "../mongo/block";
import BlockModel from "../mongo/block/BlockModel";
import connection from "../mongo/defaultConnection";

export default async function lowerCaseBlockNames() {
  // Lowercases block names to lowerCasedName
  console.log(`Script - ${__filename} - started`);

  const blockModel = new BlockModel({ connection: connection.getConnection() });

  await blockModel.model.init();

  const cursor = blockModel.model.find({}, "name lowerCasedName").cursor();

  try {
    for (
      let doc: IBlockDocument = await cursor.next();
      doc !== null;
      doc = await cursor.next()
    ) {
      if (doc.name) {
        doc.lowerCasedName = doc.name.toLowerCase();
      }

      await doc.save();
    }

    console.log(`Script - ${__filename} - completed`);
  } catch (error) {
    console.log(`Script - ${__filename} - error`);
    console.log("- - - - -");
    console.error(error);
    console.log("- - - - -");
  }
}
