import { useSelector, useDispatch } from "react-redux";
import { signOut } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../store";
import { MdNote } from "react-icons/md";

export default function Navbar() {
  const user = useSelector((s: RootState) => s.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleSignOut() {
    dispatch(signOut());
    navigate("/signin");
  }

  return (
    <nav className="w-full flex items-center justify-between px-4 py-3 bg-blue-700 text-white shadow-md">
      <div className="flex items-center gap-2">
        <MdNote className="h-8 w-8 text-gray-400" aria-label="Notes Icon" />
        <span className="font-bold text-lg">NotesApp</span>
      </div>
      {user && (
        <button
          onClick={handleSignOut}
          className="px-4 py-2 bg-blue-900 rounded hover:bg-blue-800 transition"
          data-testid="signout-btn"
        >
          Sign Out
        </button>
      )}
    </nav>
  );
}
