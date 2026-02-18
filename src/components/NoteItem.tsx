import { useState } from "react";
import { type Note, saveNote, removeNote } from "../features/notes/notesSlice";
import { useAppDispatch } from "../hooks";

export default function NoteItem({
  note,
  index,
  notes,
  onReorder,
}: {
  note: Note;
  index: number;
  notes: Note[];
  onReorder: (newOrder: Note[]) => void;
}) {
  const dispatch = useAppDispatch();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(note.title);

  function handleDragStart(e: React.DragEvent) {
    e.dataTransfer.setData("text/plain", String(index));
  }
  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
  }
  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const from = Number(e.dataTransfer.getData("text/plain"));
    const to = index;
    if (from === to) return;
    // Use the full Note object for reordering
    const reordered = notes.map((n) => ({ ...n }));
    const [item] = reordered.splice(from, 1);
    reordered.splice(to, 0, item);
    onReorder(reordered);
  }

  async function save() {
    await dispatch(saveNote({ ...note, title }));
    setEditing(false);
  }
  async function del() {
    await dispatch(removeNote(note.id));
  }
  function moveUp() {
    if (index === 0) return;
    const copy = notes.map((n) => ({ ...n }));
    const tmp = copy[index - 1];
    copy[index - 1] = copy[index];
    copy[index] = tmp;
    onReorder(copy);
  }
  function moveDown() {
    if (index === notes.length - 1) return;
    const copy = notes.map((n) => ({ ...n }));
    const tmp = copy[index + 1];
    copy[index + 1] = copy[index];
    copy[index] = tmp;
    onReorder(copy);
  }

  return (
    <li
      data-id={note.id}
      data-title={note.title}
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="p-3 border rounded bg-white flex items-center justify-between"
    >
      <div className="flex-1">
        {editing ? (
          <input
            data-testid="edit-input"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-1 border rounded"
          />
        ) : (
          <div className="break-all">{note.title}</div>
        )}
      </div>
      <div className="flex gap-2 ml-4">
        {editing ? (
          <>
            <button
              onClick={save}
              className="px-2 py-1 bg-blue-600 text-white rounded"
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              className="px-2 py-1 border rounded"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setEditing(true)}
              className="px-2 py-1 border rounded"
            >
              Edit
            </button>
            <button
              onClick={del}
              className="px-2 py-1 bg-red-600 text-white rounded"
            >
              Delete
            </button>

            <button
              onClick={moveUp}
              aria-label="move-up"
              className="px-2 py-1 border rounded"
              disabled={index === 0}
            >
              ↑
            </button>

            <button
              onClick={moveDown}
              aria-label="move-down"
              className="px-2 py-1 border rounded"
              disabled={index === notes.length - 1}
            >
              ↓
            </button>
          </>
        )}
      </div>
    </li>
  );
}
