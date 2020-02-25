import { getImmediateParentID, getRootBlockID } from "endpoints/block/utils";
import {
  blockTaskCollaboratorDataSchema,
  BlockType,
  IBlock,
  ISubTask,
  ITaskCollaborationData,
  ITaskCollaborator,
  mongoSubTaskSchema,
  mongoTaskCollaborationDataSchema
} from "mongo/block";
import MongoModel, {
  IDerivedMongoModelInitializationProps
} from "mongo/MongoModel";
import { Document } from "mongoose";
import NewBlockModel from "../mongo/block/BlockModel";
import connection from "../mongo/defaultConnection";

interface IOldBlock {
  customId: string;
  name: string;
  lowerCasedName: string;
  description: string;
  expectedEndAt: number;
  createdAt: number;
  color: string;
  updatedAt: number;
  type: BlockType;
  parents: string[];
  createdBy: string;
  taskCollaborationType: ITaskCollaborationData; // deprecate
  taskCollaborationData: ITaskCollaborationData;
  taskCollaborators: ITaskCollaborator[];
  priority: string;
  isBacklog: boolean;
  tasks: string[];
  groups: string[];
  projects: string[];
  groupTaskContext: string[];
  groupProjectContext: string[];
  // roles: IBlockRole[];
  subTasks: ISubTask[];
}

export interface IOldBlockDocument extends Document, IOldBlock {}

const oldBlockSchema = {
  customId: { type: String, unique: true },
  name: {
    type: String,
    index: true
  },

  // TODO: Think on, should we retain lowercased names so that we can retain the
  // user formatting of the block name?
  // TODO: Define type for blockSchema and other mongo schemas
  lowerCasedName: {
    type: String,
    index: true,
    lowercase: true
  },
  description: String,
  expectedEndAt: Number,
  createdAt: {
    type: Number,
    default: Date.now
  },
  color: String,
  updatedAt: Number,
  type: {
    type: String,
    index: true,
    lowercase: true
  },
  parents: {
    type: [String],
    index: true
  },
  createdBy: {
    type: String,
    index: true
  },

  // deprecate
  taskCollaborationType: mongoTaskCollaborationDataSchema,

  taskCollaborationData: mongoTaskCollaborationDataSchema,
  taskCollaborators: {
    type: [blockTaskCollaboratorDataSchema],
    index: true
  },
  subTasks: {
    type: [mongoSubTaskSchema]
  },
  priority: String,
  isBacklog: Boolean,
  tasks: [String],
  groups: [String],
  projects: [String],
  groupTaskContext: [String],
  groupProjectContext: [String]
};

const oldModelName = "block";
const oldCollectionName = "blocks";

class OldBlockModel extends MongoModel<IOldBlockDocument> {
  constructor(props: IDerivedMongoModelInitializationProps) {
    super({
      connection: props.connection,
      modelName: oldModelName,
      collectionName: oldCollectionName,
      rawSchema: oldBlockSchema
    });
  }
}

export default async function oldBlocksToNewBlocksScript() {
  // convert old blocks from the old DB to the new blocks in the new DB

  console.log(`script - ${__filename} - started`);

  let docsCount = 0;
  const startedInMs = Date.now();

  const oldBlockModel = new OldBlockModel({
    connection: connection.getConnection()
  });

  const newBlockModel = new NewBlockModel({
    connection: connection.getConnection()
  });

  await oldBlockModel.model.ensureIndexes();
  await newBlockModel.model.ensureIndexes();

  const cursor = oldBlockModel.model.find({}).cursor();

  try {
    for (
      let doc: IOldBlockDocument = await cursor.next();
      doc !== null;
      doc = await cursor.next()
    ) {
      const newBlock: IBlock = {
        customId: doc.customId,
        name: doc.name,
        lowerCasedName: doc.name ? doc.name.toLowerCase() : undefined,
        description: doc.description,
        expectedEndAt: doc.expectedEndAt,
        createdAt: doc.createdAt,
        color: doc.color,
        updatedAt: doc.updatedAt,
        type: doc.type,
        parent: getImmediateParentID(doc.parents),
        rootBlockID: getRootBlockID(doc.parents),
        createdBy: doc.createdBy,
        taskCollaborationData: doc.taskCollaborationData,
        taskCollaborators: doc.taskCollaborators,
        priority: doc.priority,
        tasks: doc.tasks,
        groups: doc.groups,
        projects: doc.projects,
        groupTaskContext: doc.groupTaskContext,
        groupProjectContext: doc.groupProjectContext,
        subTasks: doc.subTasks
      };

      const newBlockDocument = new newBlockModel.model(newBlock);

      await newBlockDocument.save();

      docsCount++;
    }

    // TODO: drop old block model

    const endedInMs = Date.now();
    const timeTakenInMs = startedInMs - endedInMs;
    const timeTakenInSecs = timeTakenInMs / 1000;

    console.log(`updated ${docsCount} doc(s) in ${timeTakenInSecs} secs`);
    console.log(`script - ${__filename} - completed`);
  } catch (error) {
    console.log(`script - ${__filename} - error`);
    console.log("- - - - -");
    console.error(error);
    console.log("- - - - -");
  }
}
