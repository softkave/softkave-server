import { BlockLandingPage, IBlock } from "../../../mongo/block";
import { IBaseEndpointContext } from "../../BaseEndpointContext";

export interface IGetBlockLandingPageParameters {
  customId: string;
}

export interface IGetBlockLandingPageContext extends IBaseEndpointContext {
  data: IGetBlockLandingPageParameters;
  queryBlockLandingInDB: (block: IBlock) => Promise<BlockLandingPage>;
}

export interface IGetBlockLandingPageResult {
  page: BlockLandingPage;
}
