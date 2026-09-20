import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

type ProtectedRouteProps = {
  authenticated: boolean;
  children: ReactNode;
};

function ProtectedRoute({ authenticated, children }: ProtectedRouteProps) {
  if (!authenticated) return <Navigate to="/login" replace />;

  return children;
}

export default ProtectedRoute;
