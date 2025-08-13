import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loadStoredAuth } from "@/store/slices/authSlice";
import { LoginForm } from "@/components/login-form";

const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    // Load stored authentication data on component mount
    dispatch(loadStoredAuth());
  }, [dispatch]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
        <div className="w-full max-w-4xl">
          <LoginForm />
        </div>
      </div>
    );
  }

  // Render protected content if authenticated
  return children;
};

export default ProtectedRoute;
