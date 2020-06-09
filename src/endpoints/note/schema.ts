const noteSchema = `
  type Note {
    customId: String
    blockId: String
    body: String
    createdAt: String
    createdBy: String
    color: String
    name: String
    updatedAt: String
    updatedBy: String
  }

  type MultipleNotesOpResponse {
    errors: [Error]
    notes: [Note]
  }

  input AddNoteInput {
    customId: String
    blockId: String
    body: String
    color: String
    name: String
  }

  input UpdateNoteInput {
    # blockId: String
    body: String
    color: String
    name: String
  }

  type NoteQuery {
    addNote (note: AddNoteInput!) : ErrorOnlyResponse
    updateNote (
      noteId: String!,
      data: UpdateNoteInput!
    ) : ErrorOnlyResponse
    deleteNote (noteId: String!) : ErrorOnlyResponse
    getNotes (blockId: String!) : MultipleNotesOpResponse
  }
`;

export default noteSchema;
