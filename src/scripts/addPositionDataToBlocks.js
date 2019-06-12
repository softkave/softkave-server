const randomColor = require("randomcolor");
const BlockModel = require("../mongo/BlockModel");

const blockModel = new BlockModel({ connection: null });

async function check() {
  const count = await blockModel.model
    .count({
      $or: [{ position: null }, { positionTimestamp: null }, { color: null }]
    })
    .exec();

  if (count > 0) {
    return false;
  }

  return true;
}

async function addPositionDataToBlocks() {
  let limit = 50;
  let blocks = [];
  let lastTimestamp = Date.now();
  let sum = 0;

  console.log("script started");
  console.log("-- script name: addPositionDataToBlocks");

  do {
    let bulkUpdateData = [];
    blocks = await blockModel.model
      .find(
        {
          $and: [
            { createdAt: { $lte: lastTimestamp } },
            {
              $or: [
                { position: null },
                { positionTimestamp: null },
                { color: null }
              ]
            }
          ]
        },
        "color position positionTimestamp"
      )
      .limit(limit)
      .exec();

    blocks.forEach(block => {
      let update = {};
      if (!block.color) {
        update.color = randomColor();
      }

      if (!block.position) {
        block.position = 0;
      }

      if (!block.positionTimestamp) {
        block.positionTimestamp = Date.now();
      }

      bulkUpdateData.push({
        updateOne: {
          update,
          filter: { _id: block._id }
        }
      });
    });

    if (bulkUpdateData.length > 0) {
      await blockModel.model.bulkWrite(bulkUpdateData);
    }

    if (blocks.length > 0) {
      lastTimestamp = blocks[blocks.length - 1].createdAt;
      sum += blocks.length;
    }
  } while (blocks.length > 0);

  if (await check()) {
    console.log("-- update successful");
  } else {
    console.log("-- update failed: missed some documents");
  }

  console.log(`-- updated ${sum} documents`);
  console.log("script complete");
}

addPositionDataToBlocks();
