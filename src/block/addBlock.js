const { validateBlockAdd } = require("./validator");
const { canUserPerformAction } = require("./canUserPerformAction");
const getUserFromReq = require("../getUserFromReq");
const addBlockToDb = require("./addBlockToDb");

async function addBlock({ block }, req) {
  await validateBlockAdd(block);
  const user = await getUserFromReq(req);

  if (block.permission && (block.type === "org" || block.type === "root")) {
    return { block: await addBlockToDb(block, user) };
  }

  await canUserPerformAction(
    req,
    `CREATE_${block.type.toUpperCase()}`,
    block.parents[block.parents.length - 1]
  );

  return { block: await addBlockToDb(block, user) };
}

module.exports = addBlock;
