const canReadMultipleBlocks = require("./canReadMultipleBlocks");
const { RequestError } = require("../../utils/error");
const {
  validateBlockParam,
  validateBlockTypes,
  validateGroupContexts
} = require("./validation");

async function updateBlock({
  sourceBlock,
  draggedBlock,
  destinationBlock,
  dropPosition,
  blockPosition,
  draggedBlockType,
  groupContext,
  blockModel,
  user
}) {
  sourceBlock = validateBlockParam(sourceBlock);
  draggedBlock = validateBlockParam(draggedBlock);
  destinationBlock = validateBlockParam(destinationBlock);
  draggedBlockType = validateBlockTypes([draggedBlockType])[0];
  groupContext = validateGroupContexts([groupContext])[0];
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

  const blocks = await blockModel.model.find({
    $or: queries
  });

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

  if (
    !draggedBlock ||
    !sourceBlock ||
    (sourceBlock.customId !== destinationBlock.customId && !destinationBlock)
  ) {
    throw new RequestError("error", "some blocks are missing");
  }

  await canReadMultipleBlocks({ blocks, user });
  const updates = [];
  const pluralizedType = `${draggedBlock.type}s`;

  if (draggedBlock.type === "group") {
    let pullUpdates = {};
    let pushUpdates = {};

    if (groupContext) {
      const field = `${groupContext}.${blockPosition}`;
      pullUpdates[field] = draggedBlock.customId;
      pushUpdates[groupContext] = {
        $each: [draggedBlock.customId]
      };
    } else {
      const groupTaskContext = `groupTaskContext`;
      const groupProjectContext = `groupProjectContext`;
      pullUpdates[`${groupTaskContext}.${blockPosition}`] =
        draggedBlock.customId;
      pullUpdates[`${groupProjectContext}.${blockPosition}`] =
        draggedBlock.customId;
      pushUpdates[groupContext] = {
        $each: [draggedBlock.customId]
      };

      pushUpdates[groupContext] = {
        $each: [draggedBlock.customId]
      };
    }

    const updateData = {
      $pull: {
        [blockChildIndex]: draggedBlock.customId,
        ...pullUpdates
      },
      $push: {
        [pluralizedType]: { $each: [draggedBlock.customId] },
        ...pushUpdates,
        $position: dropPosition
      }
    };

    console.log(updateData);

    updates.push({
      updateOne: {
        filter: { customId: sourceBlock.customId },
        update: updateData
      }
    });
  } else if (sourceBlock.customId === destinationBlock.customId) {
    const updateData = {
      $pull: {
        [blockChildIndex]: draggedBlock.customId
      },
      $push: {
        [pluralizedType]: { $each: [draggedBlock.customId] },
        $position: dropPosition
      }
    };

    console.log(updateData);

    updates.push({
      updateOne: {
        filter: { customId: sourceBlock.customId },
        update: updateData
      }
    });
  } else {
    // let parentIds = draggedBlock.parents;
    // const sourceBlockIdIndex = parentIds.indexOf(sourceBlock.customId);

    // if (sourceBlockIdIndex === -1) {
    //   throw new RequestError("error", "source parent not found");
    // }

    // parentIds = dotProp.set(
    //   parentIds,
    //   sourceBlockIdIndex,
    //   destinationBlock.customId
    // );

    // draggedBlock.parents = parentIds;

    // const draggedBlockType = draggedBlock.type;
    // const draggedBlockPath = `${draggedBlockType}.${draggedBlock.customId}`;

    // sourceBlock = dotProp.delete(sourceBlock, draggedBlockPath);
    // destinationBlock = dotProp.set(
    //   destinationBlock,
    //   draggedBlockPath,
    //   draggedBlock
    // );

    // const sourceBlockChildren = sourceBlock[pluralizedType];
    // const destinationBlockChildren = destinationBlock[pluralizedType];
    // const draggedBlockIndex = sourceBlockChildren.indexOf(
    //   draggedBlock.customId
    // );
    // sourceBlockChildren.splice(draggedBlockIndex, 1);
    // destinationBlockChildren.splice(dropPosition, 0, draggedBlock.customId);
    // sourceBlock[pluralizedType] = sourceBlockChildren;
    // destinationBlock[pluralizedType] = destinationBlockChildren;

    const sourceBlockUpdate = {
      $pull: {
        [blockChildIndex]: draggedBlock.customId
      }
    };

    const sourceParentIndex = draggedBlock.parents.indexOf(
      sourceBlock.customId
    );

    if (sourceParentIndex === -1) {
      throw new RequestError("error", "parent not found");
    }

    const parentIndex = `parents.${sourceParentIndex}`;
    const draggedBlockUpdate = {
      [parentIndex]: destinationBlock.customId
    };

    const draggedBlockChildrenUpdate = {
      [parentIndex]: destinationBlock.customId
    };

    const destinationBlockUpdate = {
      $push: {
        [pluralizedType]: { $each: [draggedBlock.customId] },
        $position: dropPosition
      }
    };

    console.log({
      sourceBlockUpdate,
      draggedBlockUpdate,
      draggedBlockChildrenUpdate,
      destinationBlockUpdate
    });

    updates.push({
      updateOne: {
        filter: { customId: sourceBlock.customId },
        update: sourceBlockUpdate
      },
      updateOne: {
        filter: { customId: destinationBlock.customId },
        update: destinationBlockUpdate
      },
      updateOne: {
        filter: { customId: draggedBlock.customId },
        update: draggedBlockUpdate
      },
      updateMany: {
        filter: {
          [parentIndex]: sourceBlock.customId,
          [`parents.${sourceParentIndex + 1}`]: draggedBlock.customId
        },
        update: draggedBlockChildrenUpdate
      }
    });
  }

  await blockModel.model.bulkWrite(updates);
}

module.exports = updateBlock;
