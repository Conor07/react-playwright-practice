import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import SignIn from "./pages/SignIn";
import NotesPage from "./pages/NotesPage";

export default function App() {
  return (
    <div className="h-screen max-h-screen w-screen flex flex-col bg-gray-100">
      <Navbar />
      <main className="flex-1 w-full max-w-5xl mx-auto px-2 sm:px-4 py-4 overflow-auto">
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route
            path="/notes"
            element={
              <ProtectedRoute>
                <NotesPage />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/notes" replace />} />
        </Routes>
      </main>
    </div>
  );
}
