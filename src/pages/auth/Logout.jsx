import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Loading from "../../components/Loading";

export default function Logout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await logout();
      } catch (err) {
        console.error("Logout error:", err);
      } finally {
        navigate("/login", { replace: true });
      }
    };
    performLogout();
  }, [logout, navigate]);

  return <Loading />;
}
