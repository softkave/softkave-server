import { INote } from "../../mongo/note";
import { IUser } from "../../mongo/user";
import makeSingletonFunc from "../../utilities/createSingletonFunc";
import { getDate } from "../../utilities/fns";
import getNewId from "../../utilities/getNewId";
import { saveNewItemToDb, wrapFireAndThrowError } from "../utils";
import { IBaseContext } from "./BaseContext";

export interface INoteContext {
    getNoteById: (ctx: IBaseContext, id: string) => Promise<INote | undefined>;
    updateNoteById: (
        ctx: IBaseContext,
        customId: string,
        data: Partial<INote>
    ) => Promise<INote | undefined>;
    markNoteDeleted: (
        ctx: IBaseContext,
        customId: string,
        user: IUser
    ) => Promise<void>;
    getNotesByBlockId: (ctx: IBaseContext, blockId: string) => Promise<INote[]>;
    saveNote: (
        ctx: IBaseContext,
        note: Omit<INote, "customId">
    ) => Promise<INote>;
    getNoteByName: (
        ctx: IBaseContext,
        name: string,
        blockId: string
    ) => Promise<INote | undefined>;
    noteExists: (
        ctx: IBaseContext,
        name: string,
        blockId: string
    ) => Promise<boolean>;
}

export default class NoteContext implements INoteContext {
    public getNoteById = wrapFireAndThrowError(
        (ctx: IBaseContext, id: string) => {
            return ctx.models.noteModel.model
                .findOne({ customId: id, isDeleted: false })
                .lean()
                .exec();
        }
    );

    public updateNoteById = wrapFireAndThrowError(
        (ctx: IBaseContext, customId: string, data: Partial<INote>) => {
            return ctx.models.noteModel.model
                .findOneAndUpdate({ customId }, data, { new: true })
                .lean()
                .exec();
        }
    );

    public markNoteDeleted = wrapFireAndThrowError(
        async (ctx: IBaseContext, id: string, user: IUser) => {
            const update: Partial<INote> = {
                isDeleted: true,
                deletedBy: user.customId,
                deletedAt: getDate(),
            };

            await ctx.models.noteModel.model
                .updateOne({ customId: id }, update)
                .exec();
        }
    );

    public getNotesByBlockId = wrapFireAndThrowError(
        (ctx: IBaseContext, blockId: string) => {
            return ctx.models.noteModel.model
                .find({
                    blockId,
                    isDeleted: false,
                })
                .lean()
                .exec();
        }
    );

    public getNoteByName = wrapFireAndThrowError(
        (ctx: IBaseContext, name: string, blockId: string) => {
            return ctx.models.noteModel.model
                .findOne({
                    blockId,
                    name: name.toLowerCase(),
                    isDeleted: false,
                })
                .lean()
                .exec();
        }
    );

    public noteExists = wrapFireAndThrowError(
        (ctx: IBaseContext, name: string, blockId: string) => {
            return ctx.models.noteModel.model.exists({
                blockId,
                name: name.toLowerCase(),
            });
        }
    );

    public async saveNote(ctx: IBaseContext, note: Omit<INote, "customId">) {
        const noteDoc = new ctx.models.noteModel.model(note);
        return saveNewItemToDb(() => {
            noteDoc.customId = getNewId();
            noteDoc.save();
            return noteDoc;
        });
    }
}

export const getNoteContext = makeSingletonFunc(() => new NoteContext());
