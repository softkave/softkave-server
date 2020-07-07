import { INote, INoteModel } from "../../mongo/note";
import { IUser } from "../../mongo/user";
import { ServerError } from "../../utilities/errors";
import { getDate } from "../../utilities/fns";
import logger from "../../utilities/logger";
import { NoteDoesNotExistError } from "../note/errors";

export interface INoteContextModels {
  noteModel: INoteModel;
}

export interface INoteContext {
  getNoteById: (
    models: INoteContextModels,
    id: string
  ) => Promise<INote | undefined>;
  updateNoteById: (
    models: INoteContextModels,
    customId: string,
    data: Partial<INote>,
    ensureNoteExists?: boolean
  ) => Promise<boolean | undefined>;
  markNoteDeleted: (
    models: INoteContextModels,
    customId: string,
    user: IUser
  ) => Promise<void>;
  getNotesByBlockId: (
    models: INoteContextModels,
    blockId: string
  ) => Promise<INote[]>;
  saveNote: (models: INoteContextModels, note: INote) => Promise<INote>;
  getNoteByName: (
    models: INoteContextModels,
    name: string,
    blockId: string
  ) => Promise<INote | undefined>;
}

export default class NoteContext implements INoteContext {
  public async getNoteById(models: INoteContextModels, id: string) {
    try {
      return await models.noteModel.model
        .findOne({ customId: id, isDeleted: false })
        .lean()
        .exec();
    } catch (error) {
      logger.error(error);
      throw new ServerError();
    }
  }

  public async updateNoteById(
    models: INoteContextModels,
    customId: string,
    data: Partial<INote>,
    ensureNoteExists?: boolean
  ) {
    try {
      if (ensureNoteExists) {
        const note = await models.noteModel.model
          .findOneAndUpdate({ customId, isDeleted: false }, data, {
            fields: "customId",
          })
          .exec();

        if (note && note.customId) {
          return true;
        } else {
          throw new NoteDoesNotExistError(); // should we include id
        }
      } else {
        await models.noteModel.model.updateOne({ customId }, data).exec();
      }
    } catch (error) {
      logger.error(error);
      throw new ServerError();
    }
  }

  public async markNoteDeleted(
    models: INoteContextModels,
    id: string,
    user: IUser
  ) {
    try {
      const update: Partial<INote> = {
        isDeleted: true,
        deletedBy: user.customId,
        deletedAt: getDate(),
      };

      await models.noteModel.model.updateOne({ customId: id }, update).exec();
    } catch (error) {
      logger.error(error);
      throw new ServerError();
    }
  }

  public async getNotesByBlockId(models, blockId: string) {
    try {
      return await models.noteModel.model
        .find({
          blockId,
          isDeleted: false,
        })
        .lean()
        .exec();
    } catch (error) {
      logger.error(error);
      throw new ServerError();
    }
  }

  public async saveNote(models, note: INote) {
    try {
      const n = new models.noteModel.model(note);
      n.save();
      return n;
    } catch (error) {
      logger.error(error);
      throw new ServerError();
    }
  }

  public async getNoteByName(
    models: INoteContextModels,
    name: string,
    blockId: string
  ) {
    try {
      return await models.noteModel.model
        .findOne({
          blockId,
          name: name.toLowerCase(),
          isDeleted: false,
        })
        .exec();
    } catch (error) {
      logger.error(error);
      throw new ServerError();
    }
  }
}
