const canReadBlock = require("./canReadBlock");

async function canReadMultipleBlocks({ blocks, user }) {
  await Promise.all(
    blocks.map(block => {
      return canReadBlock({ block, user });
    })
  );
}

module.exports = canReadMultipleBlocks;
