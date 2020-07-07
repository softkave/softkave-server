export interface INewNoteInput {
  customId: string;
  blockId: string;
  body: string;
  color: string;
  name: string;
}

export interface IUpdateNoteInput {
  // blockId: string;
  body: string;
  color: string;
  name: string;
}
