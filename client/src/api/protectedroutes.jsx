import React from "react";
import { Navigate } from "react-router-dom";
import  useAuthstore  from "../store/auth-store";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuthstore();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
