import { BlockType, IBlock, IBlockModel } from "../../mongo/block";
import mongoConstants from "../../mongo/constants";
import { IUser } from "../../mongo/user";
import { ServerError } from "../../utilities/errors";
import logger from "../../utilities/logger";
import { BlockDoesNotExistError } from "../block/errors";
import { IBulkUpdateByIdItem } from "./types";

export interface IBlockContextModels {
  blockModel: IBlockModel;
}

export interface IBlockContext {
  getBlockById: (
    models: IBlockContextModels,
    customId: string
  ) => Promise<IBlock | undefined>;
  getBlockByName: (
    models: IBlockContextModels,
    name: string
  ) => Promise<IBlock | undefined>;
  bulkGetBlocksByIds: (
    models: IBlockContextModels,
    customIds: string[]
  ) => Promise<IBlock[]>;
  updateBlockById: (
    models: IBlockContextModels,
    customId: string,
    data: Partial<IBlock>,
    ensureBlockExists?: boolean
  ) => Promise<boolean | undefined>;
  bulkUpdateBlocksById: (
    models: IBlockContextModels,
    blocks: Array<IBulkUpdateByIdItem<IBlock>>
  ) => Promise<void>;
  saveBlock: (models: IBlockContextModels, block: IBlock) => Promise<IBlock>;
  markBlockDeleted: (
    models: IBlockContextModels,
    customId: string,
    user: IUser
  ) => Promise<void>;
  markBlockChildrenDeleted: (
    models: IBlockContextModels,
    customId: string,
    user: IUser
  ) => Promise<void>;
  getBlockChildren: (
    models: IBlockContextModels,
    customId: string,
    typeList: BlockType[]
  ) => Promise<IBlock[]>;
  getUserRootBlocks: (
    models: IBlockContextModels,
    user: IUser
  ) => Promise<IBlock[]>;
}

export default class BlockContext implements IBlockContext {
  public async getBlockById(models: IBlockContextModels, customId: string) {
    try {
      return await models.blockModel.model
        .findOne({
          customId,
          isDeleted: false,
        })
        .lean()
        .exec();
    } catch (error) {
      logger.error(error);
      throw new ServerError();
    }
  }

  public async bulkGetBlocksByIds(
    models: IBlockContextModels,
    customIds: string[]
  ) {
    try {
      const query = {
        customId: { $in: customIds },
        isDeleted: false,
      };

      return await models.blockModel.model.find(query).exec();
    } catch (error) {
      logger.error(error);
      throw new ServerError();
    }
  }

  public async updateBlockById(
    models: IBlockContextModels,
    customId: string,
    data: Partial<IBlock>,
    ensureBlockExists?: boolean
  ) {
    try {
      if (ensureBlockExists) {
        const block = await models.blockModel.model
          .findOneAndUpdate({ customId }, data, { fields: "customId" })
          .exec();

        if (block && block.customId) {
          return true;
        } else {
          throw new BlockDoesNotExistError(); // should we include id
        }
      } else {
        await models.blockModel.model.updateOne({ customId }, data).exec();
      }
    } catch (error) {
      logger.error(error);
      throw new ServerError();
    }
  }

  public async bulkUpdateBlocksById(
    models: IBlockContextModels,
    blocks: Array<IBulkUpdateByIdItem<IBlock>>
  ) {
    try {
      const opts = blocks.map((b) => ({
        updateOne: { filter: { customId: b.id }, update: b.data },
      }));

      await models.blockModel.model.bulkWrite(opts);
    } catch (error) {
      logger.error(error);
      throw new ServerError();
    }
  }

  public async getBlockByName(models: IBlockContextModels, name: string) {
    try {
      return await models.blockModel.model
        .findOne({
          lowerCasedName: name.toLowerCase(),
          isDeleted: false,
        })
        .exec();
    } catch (error) {
      logger.error(error);
      throw new ServerError();
    }
  }

  public async saveBlock(models: IBlockContextModels, block: IBlock) {
    try {
      const newBlock = new models.blockModel.model(block);
      await newBlock.save();

      return newBlock;
    } catch (error) {
      // Adding a block fails with code 11000 if unique fields like customId
      if (error.code === mongoConstants.indexNotUniqueErrorCode) {
        // TODO: Implement a way to get a new customId and retry
        throw new ServerError();
      }

      logger.error(error);
      throw new ServerError();
    }
  }

  public async markBlockDeleted(
    models: IBlockContextModels,
    customId: string,
    user: IUser
  ) {
    try {
      const update: Partial<IBlock> = {
        isDeleted: true,
        deletedBy: user.customId,
        deletedAt: new Date().toString(),
      };

      await models.blockModel.model.updateOne({ customId }, update).exec();
      await this.markBlockChildrenDeleted(models, customId, user);
    } catch (error) {
      logger.error(error);
      throw new ServerError();
    }
  }

  public async getBlockChildren(
    models: IBlockContextModels,
    blockId: string,
    typeList?: BlockType[]
  ) {
    try {
      const query: any = { isDeleted: false };

      if (typeList) {
        query.type = {
          $in: typeList,
        };
      }

      query.parent = blockId;
      const blocks = await models.blockModel.model.find(query).exec();

      return blocks;
    } catch (error) {
      logger.error(error);
      throw new ServerError();
    }
  }

  public async markBlockChildrenDeleted(
    models: IBlockContextModels,
    customId: string,
    user: IUser
  ) {
    try {
      const update: Partial<IBlock> = {
        isDeleted: true,
        deletedBy: user.customId,
        deletedAt: new Date().toString(),
      };
      await models.blockModel.model
        .updateMany({ parent: customId }, update)
        .exec();

      const blockChildren = await this.getBlockChildren(models, customId);

      // TODO: how can we find out if all the children are marked deleted?
      // TODO: what happens when one of them fails?
      // TODO: should we wait for all the children to be deleted?
      blockChildren.map((block) =>
        this.markBlockChildrenDeleted(models, block.customId, user).catch(
          (error) => {
            // fire and forget
            // TODO: log error
          }
        )
      );
    } catch (error) {
      logger.error(error);
      throw new ServerError();
    }
  }

  public async getUserRootBlocks(models, user: IUser) {
    try {
      const organizationIds = user.orgs.map((org) => org.customId);
      const query = {
        customId: {
          $in: organizationIds,
        },
        isDeleted: false,
      };

      return await models.blockModel.model.find(query).lean().exec();
    } catch (error) {
      logger.error(error);
      throw new ServerError();
    }
  }
}
