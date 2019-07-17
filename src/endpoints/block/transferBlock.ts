import AccessControlModel from "../../mongo/access-control/AccessControlModel";
import BlockModel from "../../mongo/block/BlockModel";
import { add, getIndex, move, remove } from "../../utils/utils";
import { IUserDocument } from "../user/user";
import accessControlCheck from "./accessControlCheck";
import { CRUDActionsMap } from "./actions";
import blockError from "./blockError";
import { blockConstants } from "./constants";
import {
  validateBlockParam,
  validateBlockTypes,
  validateGroupContexts
} from "./validation";

// TODO: define any types, and make sure other types are correct
export interface ITransferBlockParameters {
  sourceBlock: any;
  draggedBlock: any;
  destinationBlock: any;
  dropPosition: number;
  blockPosition: number;
  draggedBlockType: string;
  groupContext: string;
  blockModel: BlockModel;
  user: IUserDocument;
  accessControlModel: AccessControlModel;
}

async function transferBlock({
  sourceBlock,
  draggedBlock,
  destinationBlock,
  dropPosition,
  blockPosition,
  draggedBlockType,
  groupContext,
  blockModel,
  user,
  accessControlModel
}: ITransferBlockParameters) {
  sourceBlock = validateBlockParam(sourceBlock);
  draggedBlock = validateBlockParam(draggedBlock);
  destinationBlock = validateBlockParam(destinationBlock);
  draggedBlockType = validateBlockTypes([draggedBlockType])[0];

  if (groupContext) {
    groupContext = validateGroupContexts([groupContext])[0];
  }

  const blockChildIndex = `${draggedBlockType}s.${blockPosition}`;
  const sourceBlockQuery = {
    customId: sourceBlock.customId,
    [blockChildIndex]: draggedBlock.customId
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

  const pushUpdates = [];
  const pluralizedType = `${draggedBlock.type}s`;

  if (draggedBlock.type === blockConstants.blockTypes.group) {
    const sourceBlockUpdates: any = {};

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

    sourceBlockUpdates[pluralizedType] = move(
      sourceBlock[pluralizedType],
      draggedBlock.customId,
      dropPosition,
      blockError.transferDraggedBlockNotFoundInParent
    );

    pushUpdates.push({
      updateOne: {
        filter: { customId: sourceBlock.customId },
        update: sourceBlockUpdates
      }
    });
  } else if (sourceBlock.customId === destinationBlock.customId) {
    const sourceBlockUpdates: any = {};

    sourceBlockUpdates[pluralizedType] = move(
      sourceBlock[pluralizedType],
      draggedBlock.customId,
      dropPosition,
      blockError.transferDraggedBlockNotFoundInParent
    );

    pushUpdates.push({
      updateOne: {
        filter: { customId: sourceBlock.customId },
        update: sourceBlockUpdates
      }
    });
  } else {
    const sourceBlockUpdates: any = {};
    const draggedBlockUpdates: any = {};
    const destinationBlockUpdates: any = {};
    const sourceParentIndex = getIndex(
      draggedBlock.parents,
      sourceBlock.customId,
      blockError.transferDraggedBlockNotFoundInParent
    );

    sourceBlockUpdates[pluralizedType] = remove(
      sourceBlock[pluralizedType],
      draggedBlock.customId,
      blockError.transferDraggedBlockNotFoundInParent
    );

    destinationBlockUpdates[pluralizedType] = add(
      destinationBlock[pluralizedType],
      draggedBlock.customId,
      dropPosition
    );

    const draggedBlockParentUpdate = [...(destinationBlock.parents || [])];
    draggedBlockParentUpdate.push(destinationBlock.customId);
    draggedBlockUpdates.parents = draggedBlockParentUpdate;

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
      },
      {
        updateMany: {
          filter: {
            [`parents.${sourceParentIndex + 1}`]: draggedBlock.customId
          },
          update: draggedBlockUpdates.parents.reduce(
            (update: any, id: string, index: number) => {
              update[`parents.${index}`] = id;
              return update;
            },
            {}
          )
        }
      }
    );
  }

  if (pushUpdates.length > 0) {
    await blockModel.model.bulkWrite(pushUpdates);
  }
}

export default transferBlock;
