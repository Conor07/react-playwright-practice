import { useEffect, useState } from "react";

import { signIn } from "../features/auth/authSlice";
import { useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../hooks";
import type { RootState } from "../store";

export default function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useAppDispatch();
  const user = useSelector((s: RootState) => s.auth.user);
  const navigate = useNavigate();

  async function handleSubmit(e: any) {
    e.preventDefault();
    if (!username || !password) {
      setError("Username and password are required.");
      return;
    }
    setError("");
    await dispatch(signIn({ username }));
    navigate("/notes");
  }

  useEffect(() => {
    if (user) navigate("/notes");
  }, [user, navigate]);

  return (
    <div className="h-full min-h-screen flex items-center justify-center bg-gray-50 overflow-auto">
      <form
        onSubmit={handleSubmit}
        className="p-6 bg-white rounded shadow w-full max-w-md"
      >
        <h2 className="text-2xl mb-4">Sign In</h2>
        <label className="block mb-2">Username</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
          placeholder="your name"
          data-testid="username-input"
        />
        <label className="block mb-2">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
          placeholder="password"
          data-testid="password-input"
        />
        {error && (
          <div className="text-red-600 mb-2" data-testid="error-msg">
            {error}
          </div>
        )}
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded"
          data-testid="signin-btn"
        >
          Sign in
        </button>
      </form>
    </div>
  );
}
