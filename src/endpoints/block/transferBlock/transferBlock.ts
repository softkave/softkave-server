import { IBlock } from "mongo/block";
import { validate } from "utils/joiUtils";
import canReadBlock from "../canReadBlock";
import { DraggedBlockDoesNotExistInSourceBlockError } from "../errors";
import {
  IGetUserDataContext,
  IGetUserDataResult,
  ITransferBlockContext
} from "./types";
import { transferBlockJoiSchema } from "./validation";

// TODO: define any types, and make sure other types are correct
export interface ITransferBlockParameters {
  sourceBlock: IBlockParam;
  draggedBlock: IBlockParam;
  draggedBlockType: string;
  blockModel: BlockModel;
  user: IUserDocument;
  accessControlModel: AccessControlModel;
  destinationBlock: IBlockParam;
  dropPosition?: number;
  groupContext?: string;
}

function validateParameters(props: ITransferBlockParameters) {
  const result = validate(
    {
      sourceBlock: props.sourceBlock,
      draggedBlock: props.draggedBlock,
      destinationBlock: props.destinationBlock,
      dropPosition: props.dropPosition,
      draggedBlockType: props.draggedBlockType,
      groupContext: props.groupContext
    },
    transferBlockJoiSchema
  );

  return result;
}

interface IFetchBlocksResult {
  sourceBlock?: IBlockDocument;
  draggedBlock?: IBlockDocument;
  destinationBlock?: IBlockDocument;
}

async function fetchBlocks(
  props: ITransferBlockParameters
): Promise<IFetchBlocksResult> {
  const {
    sourceBlock,
    draggedBlock,
    draggedBlockType,
    destinationBlock,
    blockModel
  } = props;

  const sourceBlockQuery = {
    customId: sourceBlock.customId,
    [`${draggedBlockType}s`]: draggedBlock.customId
  };

  const draggedBlockQuery = {
    customId: draggedBlock.customId,
    type: draggedBlockType
  };

  const destinationBlockQuery = { customId: destinationBlock.customId };
  const queries = [sourceBlockQuery, draggedBlockQuery];

  if (sourceBlock.customId !== destinationBlock.customId) {
    queries.push(destinationBlockQuery);
  }

  const blocks = await blockModel.model
    .find({
      $or: queries
    })
    .exec();

  const result: IFetchBlocksResult = {};

  blocks.forEach(block => {
    switch (block.customId) {
      case sourceBlock.customId:
        result.sourceBlock = block;
        break;

      case draggedBlock.customId:
        result.draggedBlock = block;
        break;

      case destinationBlock.customId:
        result.destinationBlock = block;
        break;
    }
  });

  return result;
}

async function checkBlocks(
  blocks: IFetchBlocksResult,
  props: ITransferBlockParameters
) {
  const { sourceBlock, draggedBlock, destinationBlock } = blocks;
  const { user, accessControlModel } = props;
  // add batching of access control checks
  if (!draggedBlock) {
    throw blockError.transferDraggedBlockMissing;
  } else {
    await accessControlCheck({
      user,
      accessControlModel,
      block: draggedBlock,
      CRUDActionName: CRUDActionsMap.UPDATE
    });
  }

  if (!sourceBlock) {
    throw blockError.transferSourceBlockMissing;
  } else {
    await accessControlCheck({
      user,
      accessControlModel,
      block: sourceBlock,
      CRUDActionName: CRUDActionsMap.UPDATE
    });
  }

  if (sourceBlock.customId !== destinationBlock.customId && !destinationBlock) {
    throw blockError.transferDestinationBlockMissing;
  } else if (destinationBlock) {
    await accessControlCheck({
      user,
      accessControlModel,
      block: destinationBlock,
      CRUDActionName: CRUDActionsMap.UPDATE
    });
  }
}

function updateDraggedBlockPositionInSource(
  props: IFetchBlocksResult & { dropPosition: number; groupContext?: string }
) {
  const { groupContext, sourceBlock, draggedBlock, dropPosition } = props;
  const sourceBlockUpdates: Partial<IBlock> = {};

  if (draggedBlock.type === blockConstants.blockTypes.group) {
    if (groupContext) {
      sourceBlockUpdates[groupContext] = move(
        sourceBlock[groupContext],
        draggedBlock.customId,
        dropPosition,
        blockError.transferDraggedBlockNotFoundInParent
      );
    } else {
      const groupTaskContext = blockConstants.groupContexts.groupTaskContext;
      const groupProjectContext =
        blockConstants.groupContexts.groupProjectContext;

      sourceBlockUpdates[groupTaskContext] = move(
        sourceBlock[groupTaskContext],
        draggedBlock.customId,
        dropPosition,
        blockError.transferDraggedBlockNotFoundInParent
      );

      sourceBlockUpdates[groupProjectContext] = move(
        sourceBlock[groupProjectContext],
        draggedBlock.customId,
        dropPosition,
        blockError.transferDraggedBlockNotFoundInParent
      );
    }
  }

  const pluralizedType = `${draggedBlock.type}s`;
  sourceBlockUpdates[pluralizedType] = move(
    sourceBlock[pluralizedType],
    draggedBlock.customId,
    dropPosition,
    blockError.transferDraggedBlockNotFoundInParent
  );

  return sourceBlockUpdates;
}

function updateDraggedBlockInSourceAndDestination(props: IFetchBlocksResult) {
  const { draggedBlock, sourceBlock, destinationBlock } = props;
  const sourceBlockUpdates: Partial<IBlock> = {};
  const draggedBlockUpdates: Partial<IBlock> = {};
  const destinationBlockUpdates: Partial<IBlock> = {};
  const pluralizedType = `${draggedBlock.type}s`;

  if (draggedBlock.type === blockConstants.blockTypes.group) {
    const groupTaskContext = blockConstants.groupContexts.groupTaskContext;
    const groupProjectContext =
      blockConstants.groupContexts.groupProjectContext;

    sourceBlockUpdates[groupTaskContext] = remove(
      sourceBlock[groupTaskContext],
      draggedBlock.customId,
      blockError.transferDraggedBlockNotFoundInParent
    );

    sourceBlockUpdates[groupProjectContext] = remove(
      sourceBlock[groupProjectContext],
      draggedBlock.customId,
      blockError.transferDraggedBlockNotFoundInParent
    );

    destinationBlockUpdates[groupTaskContext] = add(
      destinationBlock[pluralizedType],
      draggedBlock.customId
    );

    destinationBlockUpdates[groupProjectContext] = add(
      destinationBlock[pluralizedType],
      draggedBlock.customId
    );
  }

  sourceBlockUpdates[pluralizedType] = remove(
    sourceBlock[pluralizedType],
    draggedBlock.customId,
    blockError.transferDraggedBlockNotFoundInParent
  );

  destinationBlockUpdates[pluralizedType] = add(
    destinationBlock[pluralizedType],
    draggedBlock.customId
  );

  const draggedBlockParentUpdate = [...(destinationBlock.parents || [])];
  draggedBlockParentUpdate.push(destinationBlock.customId);
  draggedBlockUpdates.parents = draggedBlockParentUpdate;

  return {
    sourceBlockUpdates,
    destinationBlockUpdates,
    draggedBlockUpdates
  };
}

async function transferBlock(context: ITransferBlockContext): Promise<void> {
  const result = validate(context.data, transferBlockJoiSchema);

  const dropPosition = result.dropPosition;
  const groupContext = result.groupContext;
  const blockIDs = [result.draggedBlock, result.sourceBlock];

  if (result.destinationBlock !== result.sourceBlock) {
    blockIDs.push(result.destinationBlock);
  }

  const blocks = await context.getBlockListWithIDs(blockIDs);
  let sourceBlock: IBlock;
  let draggedBlock: IBlock;
  let destinationBlock: IBlock;
  const user = await context.getUser();

  blocks.forEach(block => {
    switch (block.customId) {
      case sourceBlock.customId:
        sourceBlock = block;
        break;

      case draggedBlock.customId:
        draggedBlock = block;
        break;

      case destinationBlock.customId:
        destinationBlock = block;
        break;
    }
  });

  canReadBlock({ user, block: sourceBlock });

  if (result.destinationBlock !== result.sourceBlock) {
    canReadBlock({ user, block: destinationBlock });
  }

  const pushUpdates = [];
  const draggedBlockContainerName = `${draggedBlock.type}s`;
  const draggedBlockContainer: string[] =
    sourceBlock[draggedBlockContainerName];
  const draggedBlockIndexInSourceBlock = draggedBlockContainer.indexOf(
    draggedBlock.customId
  );

  if (draggedBlockIndexInSourceBlock === -1) {
    throw new DraggedBlockDoesNotExistInSourceBlockError();
  }

  if (sourceBlock.customId === destinationBlock.customId) {
    draggedBlockContainer.splice(draggedBlockIndexInSourceBlock, 1);
    draggedBlockContainer.splice(dropPosition, 0, draggedBlock.customId);

    // TODO: do group contexts

    // const sourceBlockUpdates = updateDraggedBlockPositionInSource({
    //   ...fetchBlocksResult,
    //   dropPosition,
    //   groupContext
    // });

    // pushUpdates.push({
    //   updateOne: {
    //     filter: { customId: sourceBlock.customId },
    //     update: sourceBlockUpdates
    //   }
    // });
  } else {
    // Ignores paremeters' groupContext and dropPosition
    // const sourceParentIndex = getIndex(
    //   draggedBlock.parents,
    //   sourceBlock.customId,
    //   blockError.transferDraggedBlockNotFoundInParent
    // );

    const draggedBlockUpdates: Partial<IBlock> = {
      parent: destinationBlock.customId,
      rootBlockID: ""
    };

    const sourceBlockUpdates: Partial<IBlock> = {};

    const destinationBlockUpdates: Partial<IBlock> = {};

    // const {
    //   sourceBlockUpdates,
    //   destinationBlockUpdates,
    //   draggedBlockUpdates
    // } = updateDraggedBlockInSourceAndDestination(fetchBlocksResult);

    pushUpdates.push(
      {
        updateOne: {
          filter: { customId: sourceBlock.customId },
          update: sourceBlockUpdates
        }
      },
      {
        updateOne: {
          filter: { customId: destinationBlock.customId },
          update: destinationBlockUpdates
        }
      },
      {
        updateOne: {
          filter: { customId: draggedBlock.customId },
          update: draggedBlockUpdates
        }
      }
    );

    if (draggedBlock.type !== blockConstants.blockTypes.task) {
      pushUpdates.push({
        updateMany: {
          filter: {
            [`parents.${sourceParentIndex + 1}`]: draggedBlock.customId
          },
          update: {
            $pull: {
              parents: sourceBlock.parents.concat(sourceBlock.customId)
            },
            $push: {
              parents: { $each: draggedBlock.parents },
              $position: 0
            }
          }
        }
      });
    }
  }

  if (pushUpdates.length > 0) {
    await blockModel.model.bulkWrite(pushUpdates);
  }
}

export default transferBlock;
