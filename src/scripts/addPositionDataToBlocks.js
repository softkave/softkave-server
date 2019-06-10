const randomColor = require("randomcolor");
const blockModel = require("../mongo/BlockModel");

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

    blocks.foreach(block => {
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

  console.log(`-- updated ${sum} documents`);
  console.log("script complete");
}

addPositionDataToBlocks();
