import BlockModel from "../mongo/block/BlockModel";
import connection from "../mongo/defaultConnection";

export default async function initTaskCollaborationType() {
  // Initialize task collaboration type information in tasks where it's empty
  console.log(`script - ${__filename} - started`);

  const blockModel = new BlockModel({ connection: connection.getConnection() });

  await blockModel.model.ensureIndexes();

  try {
    const query = {
      $or: [
        { type: "task", taskCollaborationType: null },
        { type: "task", ["taskCollaborationType.collaborationType"]: null }
      ]
    };
    const docsCount = await blockModel.model.countDocuments(query).exec();

    await blockModel.model
      .updateMany(query, {
        taskCollaborationType: { collaborationType: "collective" }
      })
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
