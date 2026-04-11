import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    toast({
      title: "Signed out",
      description: "You have been logged out successfully.",
    });
    navigate("/login", { replace: true });
  }, [navigate]);

  return null;
};

export default Logout;
