import React from "react";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/store/slices/authSlice";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { IconLogout } from "@tabler/icons-react";

const LogoutButton = ({
  className = "",
  variant = "ghost",
  size = "sm",
  showText = true,
}) => {
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleLogout}
      className={`w-full justify-start gap-2 ${className}`}
    >
      <IconLogout className="h-4 w-4" />
      {showText && <span>Logout</span>}
    </Button>
  );
};

export default LogoutButton;
