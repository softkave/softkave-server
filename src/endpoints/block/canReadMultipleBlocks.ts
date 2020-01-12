import { IBlock } from "../../mongo/block";
import { IUserDocument } from "../user/user";
import canReadBlock from "./canReadBlock";

export interface ICanReadMultipleBlocksParameters {
  blocks: IBlock[];
  user: IUserDocument;
}

async function canReadMultipleBlocks({
  blocks,
  user
}: ICanReadMultipleBlocksParameters) {
  await Promise.all(
    blocks.map(block => {
      return canReadBlock({ block, user });
    })
  );
}

export default canReadMultipleBlocks;
