const canReadMultipleBlocks = require("./canReadMultipleBlocks");
const { RequestError } = require("../../utils/error");
const {
  validateBlockParam,
  validateBlockTypes,
  validateGroupContexts
} = require("./validation");

function getIndex(list, id) {
  const idIndex = list.indexOf(id);

  if (idIndex === -1) {
    throw new RequestError("error", "id not found");
  }

  return idIndex;
}

function move(list, id, dropPosition) {
  const idIndex = getIndex(list, id);
  list = [...list];
  list.splice(idIndex, 1);
  list.splice(dropPosition, 0, id);
  return list;
}

// function update(list, id, updateId) {
//   const idIndex = getIndex(list, id);
// list = [...list];
//   list[idIndex] = updateId;
//   return list;
// }

function remove(list, id) {
  const idIndex = getIndex(list, id);
  list = [...list];
  list.splice(idIndex, 1);
  return list;
}

function add(list, id, dropPosition) {
  list = [...list];
  list.splice(dropPosition, 0, id);
  return list;
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
  user
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

  if (
    !draggedBlock ||
    !sourceBlock ||
    (sourceBlock.customId !== destinationBlock.customId && !destinationBlock)
  ) {
    throw new RequestError("error", "some blocks are missing");
  }

  await canReadMultipleBlocks({ blocks, user });
  const pushUpdates = [];
  const pluralizedType = `${draggedBlock.type}s`;

  if (draggedBlock.type === "group") {
    const sourceBlockUpdates = {};

    if (groupContext) {
      sourceBlockUpdates[groupContext] = move(
        sourceBlock[groupContext],
        draggedBlock.customId,
        dropPosition
      );
    } else {
      const groupTaskContext = `groupTaskContext`;
      const groupProjectContext = `groupProjectContext`;

      sourceBlockUpdates[groupTaskContext] = move(
        sourceBlock[groupTaskContext],
        draggedBlock.customId,
        dropPosition
      );

      sourceBlockUpdates[groupProjectContext] = move(
        sourceBlock[groupProjectContext],
        draggedBlock.customId,
        dropPosition
      );
    }

    sourceBlockUpdates[pluralizedType] = move(
      sourceBlock[pluralizedType],
      draggedBlock.customId,
      dropPosition
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
      dropPosition
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
      sourceBlock.customId
    );

    sourceBlockUpdates[pluralizedType] = remove(
      sourceBlock[pluralizedType],
      draggedBlock.customId
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
