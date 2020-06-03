// color in status
// remove groups, and put it's tasks or projects to the nearest parent - c
// all tasks in orgs to system created board
// new format
// project to board
// close the cursor when done

import { Connection, Document } from "mongoose";
import randomColor from "randomcolor";
import uuid from "uuid/v4";
import { System } from "../mongo/audit-log";
import { getBlockModel } from "../mongo/block/BlockModel";
import {
  blockSchema0,
  BlockType,
  IBlock,
  IBlock0,
} from "../mongo/block/definitions";
import { getDefaultConnection } from "../mongo/defaultConnection";
import MongoModel from "../mongo/MongoModel";
import { getDate } from "../utilities/fns";

let blk0Model: MongoModel = null;

export function getBlock0Model(conn: Connection) {
  if (blk0Model) {
    return blk0Model;
  }

  blk0Model = new MongoModel({
    modelName: "block-v2",
    collectionName: "blocks-v2",
    rawSchema: blockSchema0,
    connection: conn,
  });

  return blk0Model;
}

async function removeGroups() {
  console.log(`script - removeGroups - started`);

  let docsCount = 0;
  const blockModel = getBlock0Model(getDefaultConnection().getConnection());
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
  const name = "new-board";
  const description =
    "Please change the name of this board. " +
    "This name was system generated during an update that required a move and reclassification of data.";
  const blockModel = getBlock0Model(getDefaultConnection().getConnection());
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
            type: "task",
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
  const blockModel0 = getBlock0Model(getDefaultConnection().getConnection());
  await blockModel0.model.ensureIndexes();
  const cursor = blockModel0.model.find({}).cursor();
  const blockModel = getBlockModel(getDefaultConnection().getConnection());
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

      if (doc.type === "org") {
        console.warn("hello world");
      }

      const block: IBlock = {
        customId: doc.customId,
        createdBy: doc.createdBy,
        createdAt: getDate(doc.createdAt),
        type: doc.type === "project" ? BlockType.Board : (doc.type as any),
        name: doc.name,
        lowerCasedName: doc.lowerCasedName,
        description: doc.description,
        dueAt: doc.expectedEndAt ? getDate(doc.expectedEndAt) : undefined,
        color: doc.color,
        updatedAt: doc.updatedAt ? getDate(doc.updatedAt) : undefined,
        updatedBy: System.System,
        parent: doc.parent, // or boardId
        rootBlockId: doc.rootBlockID,
        assignees: doc.taskCollaborators
          ? doc.taskCollaborators.map((assignee) => ({
              assignedBy: assignee.assignedBy,
              userId: assignee.userId,
              assignedAt: getDate(assignee.assignedAt),
            }))
          : undefined,
        priority: doc.priority,
        subTasks: doc.subTasks
          ? doc.subTasks.map((subtask) => ({
              createdBy: subtask.createdBy,
              customId: subtask.customId,
              description: subtask.description,
              completedBy: subtask.completedBy,
              updatedBy: subtask.updatedBy,
              completedAt: getDate(subtask.completedAt),
              createdAt: getDate(subtask.createdAt),
              updatedAt: getDate(subtask.updatedAt),
            }))
          : undefined,
        boardStatuses: doc.availableStatus
          ? doc.availableStatus.map((status) => ({
              customId: status.customId,
              name: status.name,
              createdBy: status.createdBy,
              description: status.description,
              updatedBy: status.updatedBy,
              color: randomColor(),
              createdAt: getDate(status.createdAt),
              updatedAt: getDate(status.updatedAt),
            }))
          : undefined,
        boardLabels: doc.availableLabels
          ? doc.availableLabels.map((label) => ({
              customId: label.customId,
              name: label.name,
              createdBy: label.createdBy,
              description: label.description,
              updatedBy: label.updatedBy,
              color: label.color,
              createdAt: getDate(label.createdAt),
              updatedAt: getDate(label.updatedAt),
            }))
          : undefined,
        status: doc.status,
        statusAssignedBy: System.System,
        statusAssignedAt: undefined,
        labels: (doc.labels || []).map((labelId) => ({
          customId: labelId,
          assignedAt: undefined,
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

export default async function block_v3() {
  console.log(`script - block_v3 - started`);

  try {
    await removeGroups();
    await removeTasksFromOrgsToNewProject();
    await oldBlockToNewBlock();
    console.log(`script - block_v3 - completed`);
  } catch (error) {
    console.log(`script - block_v3 - error`);
    console.log("- - - - -");
    console.error(error);
    console.log("- - - - -");
  }
}
