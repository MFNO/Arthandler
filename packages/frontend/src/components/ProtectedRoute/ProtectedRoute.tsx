import "./ProtectedRoute.css";
import { Navigate } from "react-router-dom";

type ProtectedProps = {
  authenticated: boolean;
  children: any;
};

const ProtectedRoute = (props: ProtectedProps) => {
  if (!props.authenticated) {
    return <Navigate to="/login" replace />;
  }

  return props.children;
};

export default ProtectedRoute;
