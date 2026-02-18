import { type Note } from "../features/notes/notesSlice";

const STORAGE_KEY = "mock_notes_v1";

function read() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [] as Note[];
  try {
    return JSON.parse(raw) as Note[];
  } catch {
    return [] as Note[];
  }
}
function write(notes: Note[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

function wait<T>(v: T, ms = 120) {
  return new Promise<T>((res) => setTimeout(() => res(v), ms));
}

export async function fetchNotesApi() {
  const notes = read();
  return wait(notes);
}
export async function createNoteApi(note: Partial<Note>) {
  const current = read();
  const n: Note = {
    id: String(Date.now()) + Math.random().toString(36).slice(2, 8),
    title: note.title || "Untitled",
    content: note.content || "",
  };
  current.unshift(n);
  write(current);
  return wait(n);
}
export async function updateNoteApi(note: Note) {
  const current = read();
  const idx = current.findIndex((x) => x.id === note.id);
  if (idx >= 0) current[idx] = note;
  write(current);
  return wait(note);
}
export async function deleteNoteApi(id: string) {
  const current = read().filter((x) => x.id !== id);
  write(current);
  return wait(true);
}
export async function reorderNotesApi(newOrder: Note[]) {
  write(newOrder);
  return wait(newOrder);
}
