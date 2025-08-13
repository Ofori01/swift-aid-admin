import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "@/components/login-form";
import { loginUser, clearError } from "@/store/slices/authSlice";
import { toast } from "react-hot-toast";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!credentials.email || !credentials.password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const result = await dispatch(loginUser(credentials));

      if (loginUser.fulfilled.match(result)) {
        toast.success("Login successful!");
        navigate("/dashboard");
      } else {
        toast.error(result.payload || "Login failed");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (error) {
      dispatch(clearError());
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
      <div className="w-full max-w-md">
        <LoginForm
          onSubmit={handleSubmit}
          onChange={handleInputChange}
          credentials={credentials}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  );
};

export default LoginPage;
