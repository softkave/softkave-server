const {
  validateBlockAdd
} = require("./validator");
const addBlockToDb = require("./addBlockToDb");
const canUserPerformAction = require("./canUserPerformAction");
const {
  getImmediateParentId
} = require("./utils");
const {
  trimObject,
  lowerCaseObject
} = require("../utils");

async function addBlock({
  block
}, req) {
  await validateBlockAdd(block);
  trimObject(block, {
    "description": true
  });

  // lowerCaseObject()

  if (block.type === "org") {
    let result = await addBlockToDb(block, req);
    return {
      block: result
    };
  }

  const immediateParentId = getImmediateParentId(block);
  await canUserPerformAction(req, {
    id: immediateParentId
  }, "CREATE_" + block.type.toUpperCase());

  return {
    block: await addBlockToDb(block, req)
  };
}

module.exports = addBlock;