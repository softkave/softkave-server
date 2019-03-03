const { validateBlockAdd } = require("./validator");
const getUserFromReq = require("../getUserFromReq");
const addBlockToDb = require("./addBlockToDb");
const canUserPerformAction = require("./canUserPerformAction");
const { getImmediateParentId } = require("./utils");
const findUserPermission = require("../user/findUserPermission");

async function addBlock({ block }, req) {
  await validateBlockAdd(block);
  const user = await getUserFromReq(req);

  if (block.permission && (block.type === "org" || block.type === "root")) {
    return { block: await addBlockToDb(block, user) };
  }

  // todo: make sure block has parents in validation because it's not org or root
  const immediateParentId = getImmediateParentId(block);
  await canUserPerformAction(
    immediateParentId,
    "CREATE_" + block.type.toUpperCase(),
    await findUserPermission(req, immediateParentId)
  );

  return { block: await addBlockToDb(block, user) };
}

module.exports = addBlock;
