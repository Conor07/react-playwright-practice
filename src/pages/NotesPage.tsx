import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  fetchNotes,
  addNote,
  reorderNotes,
  type Note,
} from "../features/notes/notesSlice";

import ProtectedRoute from "../components/ProtectedRoute";
import NoteItem from "../components/NoteItem";

export default function NotesPage() {
  const dispatch = useAppDispatch();
  const notes = useAppSelector((s) => s.notes.items);
  const [title, setTitle] = useState("");

  useEffect(() => {
    dispatch(fetchNotes());
  }, [dispatch]);

  async function handleAdd(e: any) {
    e.preventDefault();
    if (!title.trim()) return;
    await dispatch(addNote({ title }));
    setTitle("");
  }

  async function handleReorder(newOrder: typeof notes) {
    await dispatch(reorderNotes(newOrder));
  }

  return (
    <ProtectedRoute>
      <div className="h-full p-6 bg-gray-100 overflow-auto">
        <div className="max-w-3xl mx-auto bg-white p-4 rounded shadow">
          <h1 className="text-2xl mb-4">Notes</h1>
          <form onSubmit={handleAdd} className="flex gap-2 mb-4">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1 p-2 border rounded"
              placeholder="New note title"
            />
            <button className="px-3 py-2 bg-green-600 text-white rounded">
              Add
            </button>
          </form>

          <ul data-testid="notes-list" className="space-y-2">
            {notes.map((note: Note, idx: number) => (
              <NoteItem
                key={note.id}
                note={note}
                index={idx}
                notes={notes}
                onReorder={handleReorder}
              />
            ))}
          </ul>
        </div>
      </div>
    </ProtectedRoute>
  );
}
