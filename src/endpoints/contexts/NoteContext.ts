import { INote } from "../../mongo/note";
import { IUser } from "../../mongo/user";
import createSingletonFunc from "../../utilities/createSingletonFunc";
import { ServerError } from "../../utilities/errors";
import { getDate } from "../../utilities/fns";
import logger from "../../utilities/logger";
import { NoteDoesNotExistError } from "../note/errors";
import { IBaseContext } from "./BaseContext";

export interface INoteContext {
  getNoteById: (ctx: IBaseContext, id: string) => Promise<INote | undefined>;
  updateNoteById: (
    ctx: IBaseContext,
    customId: string,
    data: Partial<INote>,
    ensureNoteExists?: boolean
  ) => Promise<boolean | undefined>;
  markNoteDeleted: (
    ctx: IBaseContext,
    customId: string,
    user: IUser
  ) => Promise<void>;
  getNotesByBlockId: (ctx: IBaseContext, blockId: string) => Promise<INote[]>;
  saveNote: (ctx: IBaseContext, note: INote) => Promise<INote>;
  getNoteByName: (
    ctx: IBaseContext,
    name: string,
    blockId: string
  ) => Promise<INote | undefined>;
}

export default class NoteContext implements INoteContext {
  public async getNoteById(ctx: IBaseContext, id: string) {
    try {
      return await ctx.models.noteModel.model
        .findOne({ customId: id, isDeleted: false })
        .lean()
        .exec();
    } catch (error) {
      console.error(error);
      throw new ServerError();
    }
  }

  public async updateNoteById(
    ctx: IBaseContext,
    customId: string,
    data: Partial<INote>,
    ensureNoteExists?: boolean
  ) {
    try {
      if (ensureNoteExists) {
        const note = await ctx.models.noteModel.model
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
        await ctx.models.noteModel.model.updateOne({ customId }, data).exec();
      }
    } catch (error) {
      console.error(error);
      throw new ServerError();
    }
  }

  public async markNoteDeleted(ctx: IBaseContext, id: string, user: IUser) {
    try {
      const update: Partial<INote> = {
        isDeleted: true,
        deletedBy: user.customId,
        deletedAt: getDate(),
      };

      await ctx.models.noteModel.model
        .updateOne({ customId: id }, update)
        .exec();
    } catch (error) {
      console.error(error);
      throw new ServerError();
    }
  }

  public async getNotesByBlockId(ctx: IBaseContext, blockId: string) {
    try {
      return await ctx.models.noteModel.model
        .find({
          blockId,
          isDeleted: false,
        })
        .lean()
        .exec();
    } catch (error) {
      console.error(error);
      throw new ServerError();
    }
  }

  public async saveNote(ctx: IBaseContext, note: INote) {
    try {
      const n = new ctx.models.noteModel.model(note);
      n.save();
      return n;
    } catch (error) {
      console.error(error);
      throw new ServerError();
    }
  }

  public async getNoteByName(ctx: IBaseContext, name: string, blockId: string) {
    try {
      return await ctx.models.noteModel.model
        .findOne({
          blockId,
          name: name.toLowerCase(),
          isDeleted: false,
        })
        .exec();
    } catch (error) {
      console.error(error);
      throw new ServerError();
    }
  }
}

export const getNoteContext = createSingletonFunc(() => new NoteContext());
