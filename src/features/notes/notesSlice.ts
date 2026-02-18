import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import {
  fetchNotesApi,
  createNoteApi,
  updateNoteApi,
  deleteNoteApi,
  reorderNotesApi,
} from "../../mock/mockNotesApi";

export type Note = { id: string; title: string; content?: string };

export const fetchNotes = createAsyncThunk("notes/fetch", async () => {
  return await fetchNotesApi();
});
export const addNote = createAsyncThunk(
  "notes/add",
  async (note: Partial<Note>) => {
    return await createNoteApi(note);
  },
);
export const saveNote = createAsyncThunk("notes/save", async (note: Note) => {
  return await updateNoteApi(note);
});
export const removeNote = createAsyncThunk(
  "notes/remove",
  async (id: string) => {
    await deleteNoteApi(id);
    return id;
  },
);
export const reorderNotes = createAsyncThunk(
  "notes/reorder",
  async (newOrder: Note[]) => {
    return await reorderNotesApi(newOrder);
  },
);

const notesSlice = createSlice({
  name: "notes",
  initialState: { items: [] as Note[], status: "idle" as string },
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchNotes.fulfilled, (state, action: PayloadAction<Note[]>) => {
        state.items = action.payload;
      })
      .addCase(addNote.fulfilled, (state, action: PayloadAction<Note>) => {
        state.items.unshift(action.payload);
      })
      .addCase(saveNote.fulfilled, (state, action: PayloadAction<Note>) => {
        const idx = state.items.findIndex((n) => n.id === action.payload.id);
        if (idx >= 0) state.items[idx] = action.payload;
      })
      .addCase(removeNote.fulfilled, (state, action: PayloadAction<string>) => {
        state.items = state.items.filter((n) => n.id !== action.payload);
      })
      .addCase(
        reorderNotes.fulfilled,
        (state, action: PayloadAction<Note[]>) => {
          state.items = action.payload;
        },
      );
  },
});

export default notesSlice.reducer;
