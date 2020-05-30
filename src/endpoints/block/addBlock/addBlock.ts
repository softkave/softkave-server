import { validate } from "../../../utilities/joiUtils";
import canReadBlock from "../canReadBlock";
import blockValidationSchemas from "../validation";
import { AddBlockEndpoint } from "./types";

const addBlock: AddBlockEndpoint = async (context, instData) => {
  const data = validate(instData.data.block, blockValidationSchemas.newBlock);
  const newBlock = data;
  const user = await context.session.getUser(context.models, instData);

  if (newBlock.type === "org") {
    const orgSaveResult = await context.addBlock(context, {
      ...instData,
      data: { block: data },
    });

    const org = orgSaveResult.block;

    // TODO: scrub for orgs that are not added to user and add or clean them
    //    you can do this when user tries to read them, or add them again
    // TODO: scrub all data that failed it's pipeline

    const userOrgs = user.orgs.concat({ customId: org.customId });
    await context.session.updateUser(context.models, instData, {
      orgs: userOrgs,
    });
    return {
      block: org,
    };
  }

  const rootParent = await context.block.getBlockById(
    context.models,
    newBlock.rootBlockId
  );

  await canReadBlock({ user, block: rootParent });

  const result = await context.addBlock(context, {
    ...instData,
    data: { block: data },
  });
  const block = result.block;

  // TODO: analyze all the net calls you're making and look for ways to reduce them

  return {
    block,
  };
};

export default addBlock;
