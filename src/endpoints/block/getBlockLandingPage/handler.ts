import { BlockLandingPage } from "../../../mongo/block";
import { validate } from "../../../utilities/joiUtils";
import { catchAndLogError } from "../../utils";
import canReadBlock from "../canReadBlock";
import {
  IGetBlockLandingPageContext,
  IGetBlockLandingPageResult
} from "./types";
import { getBlockLandingPageJoiSchema } from "./validation";

// TODO: write checks for blocks and other fetched resources before using them
// TODO: what's the strategy for handling when blocks are deleted or added

async function getBlockLandingPage(
  context: IGetBlockLandingPageContext
): Promise<IGetBlockLandingPageResult> {
  const result = validate(context.data, getBlockLandingPageJoiSchema);
  const user = await context.getUser();
  const block = await context.getBlockByID(result.customId);

  canReadBlock({ user, block });

  let pageType: BlockLandingPage = "self";

  const hasGroups = Array.isArray(block.groups) && block.groups.length > 0;
  const hasTasks = Array.isArray(block.tasks) && block.tasks.length > 0;
  const hasProjects =
    Array.isArray(block.projects) && block.projects.length > 0;

  if (block.type === "org") {
    if (hasGroups) {
      pageType = await context.queryBlockLandingInDB(block);
    }
  } else if (block.type === "project" && hasGroups) {
    pageType = "tasks";
  } else if (hasTasks) {
    pageType = "tasks";
  } else if (hasProjects) {
    pageType = "projects";
  }

  if (block.landingPage !== pageType) {
    catchAndLogError(
      context.updateBlockByID(block.customId, { landingPage: pageType })
    );
  }

  return {
    page: pageType
  };
}

export default getBlockLandingPage;
