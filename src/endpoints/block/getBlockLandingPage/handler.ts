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

async function getBlockLandingPage(
  context: IGetBlockLandingPageContext
): Promise<IGetBlockLandingPageResult> {
  const result = validate(context.data, getBlockLandingPageJoiSchema);
  const user = await context.getUser();
  const block = await context.getBlockByID(result.customId);

  canReadBlock({ user, block });

  let pageType: BlockLandingPage = "self";

  if (block.landingPage) {
    pageType = block.landingPage;
  } else {
    const hasGroups = Array.isArray(block.groups) && block.groups.length > 0;

    if (block.type !== "org") {
      switch (block.type) {
        case "project":
          if (hasGroups) {
            pageType = "tasks";
          }
          break;

        case "group":
        case "task":
        default:
          pageType = "self";
      }
    } else {
      if (hasGroups) {
        pageType = await context.queryBlockLandingInDB(block);
      } else {
        pageType = "self";
      }
    }

    catchAndLogError(
      context.updateBlockByID(block.customId, { landingPage: pageType })
    );
  }

  return {
    page: pageType
  };
}

export default getBlockLandingPage;
