// color in status
// remove groups, and put it's tasks or projects to the nearest parent - c
// level
// all tasks in orgs to system created board
// new format
// project to board
// close the cursor when done

import { Document, QueryCursor } from "mongoose";
import uuid from "uuid/v4";
import { System } from "../mongo/audit-log";
import BlockModel from "../mongo/block/BlockModel";
import blockSchema0, {
  IBlock,
  IBlock0,
  IBlockDocument,
} from "../mongo/block/definitions";
import connection from "../mongo/defaultConnection";
import MongoModel, {
  IDerivedMongoModelInitializationProps,
} from "../mongo/MongoModel";

const modelName = "block-v2";
const collectionName = "blocks-v2";

class BlockModel0 extends MongoModel<IBlock0 & Document> {
  constructor({ connection: conn }: IDerivedMongoModelInitializationProps) {
    super({
      connection: conn,
      modelName,
      collectionName,
      rawSchema: blockSchema0,
    });
  }
}

async function removeGroups() {
  console.log(`script - removeGroups - started`);

  let docsCount = 0;
  const blockModel = new BlockModel0({
    connection: connection.getConnection(),
  });
  await blockModel.model.ensureIndexes();
  const cursor = blockModel.model
    .find({
      type: "group",
    })
    .cursor();

  try {
    for (
      let doc: IBlock0 & Document = await cursor.next();
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

      await doc.remove();
      docsCount++;
    }

    cursor.close();
    const remGroupsCount = await blockModel.model
      .count({ type: "group" })
      .exec();

    console.log(`group(s) count = ${docsCount}`);
    console.log(`group(s) remaining = ${remGroupsCount}, failed if not 0`);
    console.log(`script - removeGroups - completed`);
  } catch (error) {
    console.log(`script - removeGroups - error`);
    console.log("- - - - -");
    console.error(error);
    console.log("- - - - -");
  }
}

async function removeTasksFromOrgsToNewProject() {
  console.log(`script - removeTasksFromOrgsToNewProject - started`);

  let docsCount = 0;
  const name = "new-board-1";
  const description =
    "Please change the name of this board." +
    "This name was system generated during an update that required a move and reclassification of data.";
  const blockModel = new BlockModel0({
    connection: connection.getConnection(),
  });
  await blockModel.model.ensureIndexes();
  const cursor = blockModel.model
    .find({
      type: "org",
    })
    .cursor();

  try {
    for (
      let doc: IBlock0 & Document = await cursor.next();
      doc !== null;
      doc = await cursor.next()
    ) {
      const immediateTasksCount = await blockModel.model
        .count({ type: "task", parent: doc.customId })
        .exec();

      if (immediateTasksCount === 0) {
        continue;
      }

      const project = new blockModel.model({
        description,
        name,
        customId: uuid(),
        lowerCasedName: name,
        createdAt: Date.now(),
        color: randomColor(),
        type: "project",
        parent: doc.customId,
        rootBlockID: doc.customId,
        createdBy: System.System,
        tasks: [],
      });

      await project.save();
      await blockModel.model
        .updateMany(
          {
            parent: doc.customId,
          },
          { parent: project.customId }
        )
        .exec();

      docsCount++;
    }

    cursor.close();
    console.log(`org(s) count = ${docsCount}`);
    console.log(`script - removeTasksFromOrgsToNewProject - completed`);
  } catch (error) {
    console.log(`script - removeTasksFromOrgsToNewProject - error`);
    console.log("- - - - -");
    console.error(error);
    console.log("- - - - -");
  }
}

async function oldBlockToNewBlock() {
  console.log(`script - oldBlockToNewBlock - started`);

  let docsCount = 0;
  const now = new Date();
  const nowStr = now.toString();
  const blockModel0 = new BlockModel0({
    connection: connection.getConnection(),
  });
  await blockModel0.model.ensureIndexes();
  const cursor = blockModel0.model.find({}).cursor();
  const blockModel = new BlockModel({ connection: connection.getConnection() });
  await blockModel.model.ensureIndexes();

  try {
    for (
      let doc: IBlock0 & Document = await cursor.next();
      doc !== null;
      doc = await cursor.next()
    ) {
      if (doc.type === "group") {
        continue;
      }

      const block: IBlock = {
        customId: doc.customId,
        createdBy: doc.createdBy,
        createdAt: new Date(doc.createdAt).toString(),
        type: doc.type === "project" ? "board" : doc.type,
        level: 0,
        name: doc.name,
        lowerCasedName: doc.lowerCasedName,
        description: doc.description,
        dueAt: new Date(doc.expectedEndAt).toString(),
        color: doc.color,
        updatedAt: nowStr,
        updatedBy: System.System,
        parent: doc.parent, // or boardId
        rootBlockId: doc.rootBlockID,
        assignees: doc.taskCollaborators,
        priority: doc.priority,
        subTasks: doc.subTasks,
        boardStatuses: doc.availableStatus.map((status) => ({
          ...status,
          color: randomColor(),
        })),
        boardLabels: doc.availableLabels,
        status: doc.status,
        statusAssignedBy: System.System,
        statusAssignedAt: nowStr,
        labels: (doc.labels || []).map((labelId) => ({
          customId: labelId,
          assignedAt: nowStr,
          assignedBy: System.System,
        })),
        isDeleted: false,
        deletedAt: undefined,
        deletedBy: undefined,
      };

      const newDoc = new blockModel.model(block);
      await newDoc.save();

      docsCount++;
    }

    cursor.close();
    console.log(`block(s) count = ${docsCount}`);
    console.log(`script - oldBlockToNewBlock - completed`);
  } catch (error) {
    console.log(`script - oldBlockToNewBlock - error`);
    console.log("- - - - -");
    console.error(error);
    console.log("- - - - -");
  }
}

async function insertBlockLevel(block?: IBlockDocument) {
  console.log(`script - insertBlockLevel - started`);

  let docsCount = 0;
  const blockModel = new BlockModel({ connection: connection.getConnection() });
  await blockModel.model.ensureIndexes();
  let cursor: QueryCursor<IBlockDocument> = null;
  const level = block ? block.level + 1 : 0;

  if (block) {
    cursor = blockModel.model.find({ parent: block.customId }).cursor();
  } else {
    cursor = blockModel.model.find({ type: "org" }).cursor();
  }

  try {
    for (
      let doc: IBlockDocument = await cursor.next();
      doc !== null;
      doc = await cursor.next()
    ) {
      doc.level = level;

      if (doc.type !== "task") {
        await insertBlockLevel(doc);
      }

      docsCount++;
    }

    cursor.close();
    console.log(`block(s) count = ${docsCount}`);
    console.log(`script - insertBlockLevel - completed`);
  } catch (error) {
    console.log(`script - insertBlockLevel - error`);
    console.log("- - - - -");
    console.error(error);
    console.log("- - - - -");
  }
}

export default async function block_v3() {
  console.log(`script - block_v3 - started`);

  try {
    await removeGroups();
    await removeTasksFromOrgsToNewProject();
    await oldBlockToNewBlock();
    await insertBlockLevel();
    console.log(`script - block_v3 - completed`);
  } catch (error) {
    console.log(`script - block_v3 - error`);
    console.log("- - - - -");
    console.error(error);
    console.log("- - - - -");
  }
}
