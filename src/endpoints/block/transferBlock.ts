const { blockErrors } = require("../../utils/blockError");
const {
  validateBlockParam,
  validateBlockTypes,
  validateGroupContexts
} = require("./validation");
const { blockConstants } = require("./constants");
const accessControlCheck = require("./access-control-check");
const { CRUDActionsMap } = require("./actions");
const { getIndex, move, remove, add } = require("../../utils/utils");

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
}) {
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
    throw blockErrors.transferDraggedBlockMissing;
  } else {
    await accessControlCheck({
      user,
      accessControlModel,
      block: draggedBlock,
      CRUDActionName: CRUDActionsMap.UPDATE
    });
  }

  if (!sourceBlock) {
    throw blockErrors.transferSourceBlockMissing;
  } else {
    await accessControlCheck({
      user,
      accessControlModel,
      block: sourceBlock,
      CRUDActionName: CRUDActionsMap.UPDATE
    });
  }

  if (sourceBlock.customId !== destinationBlock.customId && !destinationBlock) {
    throw blockErrors.transferDestinationBlockMissing;
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
    const sourceBlockUpdates = {};

    if (groupContext) {
      sourceBlockUpdates[groupContext] = move(
        sourceBlock[groupContext],
        draggedBlock.customId,
        dropPosition,
        blockErrors.transferDraggedBlockNotFoundInParent
      );
    } else {
      const groupTaskContext = blockConstants.groupContexts.groupTaskContext;
      const groupProjectContext =
        blockConstants.groupContexts.groupProjectContext;

      sourceBlockUpdates[groupTaskContext] = move(
        sourceBlock[groupTaskContext],
        draggedBlock.customId,
        dropPosition,
        blockErrors.transferDraggedBlockNotFoundInParent
      );

      sourceBlockUpdates[groupProjectContext] = move(
        sourceBlock[groupProjectContext],
        draggedBlock.customId,
        dropPosition,
        blockErrors.transferDraggedBlockNotFoundInParent
      );
    }

    sourceBlockUpdates[pluralizedType] = move(
      sourceBlock[pluralizedType],
      draggedBlock.customId,
      dropPosition,
      blockErrors.transferDraggedBlockNotFoundInParent
    );

    pushUpdates.push({
      updateOne: {
        filter: { customId: sourceBlock.customId },
        update: sourceBlockUpdates
      }
    });
  } else if (sourceBlock.customId === destinationBlock.customId) {
    const sourceBlockUpdates = {};

    sourceBlockUpdates[pluralizedType] = move(
      sourceBlock[pluralizedType],
      draggedBlock.customId,
      dropPosition,
      blockErrors.transferDraggedBlockNotFoundInParent
    );

    pushUpdates.push({
      updateOne: {
        filter: { customId: sourceBlock.customId },
        update: sourceBlockUpdates
      }
    });
  } else {
    const sourceBlockUpdates = {};
    const draggedBlockUpdates = {};
    const destinationBlockUpdates = {};
    const sourceParentIndex = getIndex(
      draggedBlock.parents,
      sourceBlock.customId,
      blockErrors.transferDraggedBlockNotFoundInParent
    );

    sourceBlockUpdates[pluralizedType] = remove(
      sourceBlock[pluralizedType],
      draggedBlock.customId,
      blockErrors.transferDraggedBlockNotFoundInParent
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
          update: draggedBlockUpdates.parents.reduce((update, id, index) => {
            update[`parents.${index}`] = id;
            return update;
          }, {})
        }
      }
    );
  }

  if (pushUpdates.length > 0) {
    await blockModel.model.bulkWrite(pushUpdates);
  }
}

module.exports = transferBlock;
export {};
