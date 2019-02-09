const { validateBlockAdd } = require("./validator");
const { canUserPerformAction } = require("./canUserPerformAction");
const { RequestError } = require("../error");
const getUserFromReq = require("../getUserFromReq");
const addBlockToDb = require("./addBlockToDb");

async function addBlock({ block }, req) {
  await validateBlockAdd(block);
  const user = await getUserFromReq(req);

  // block is root level block
  if (!block.owner) {
    if (block.permission && (block.type === "org" || block.type === "root")) {
      return { block: await addBlockToDb(block, user) };
    } else {
      throw new RequestError("error", "data is invalid.");
    }
  }

  await canUserPerformAction(
    req,
    `CREATE_${block.type.toUpperCase()}`,
    block.owner
  );

  return { block: await addBlockToDb(block, user) };
}

module.exports = addBlock;
