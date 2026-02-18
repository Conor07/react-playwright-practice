import { type ReactNode } from "react";
import { useAppSelector } from "../hooks";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const user = useAppSelector((s) => s.auth.user);
  if (!user) return <Navigate to="/signin" replace />;
  return <>{children}</>;
}
