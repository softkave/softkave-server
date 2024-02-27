import {BlockDoesNotExistError} from '../../endpoints/block/errors';
import {InvalidRequestError} from '../../endpoints/errors';
import {BlockType, IBlock} from './definitions';

export function assertBlockType(block: IBlock, type: BlockType) {
  if (block.type !== type) {
    throw new InvalidRequestError();
  }
}

export function assertBlock(block?: IBlock | null): asserts block {
  if (!block) {
    throw new BlockDoesNotExistError();
  }
}
