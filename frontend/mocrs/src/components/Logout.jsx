import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import logo from "../assets/mocrs.gif";
import Nav from "./Nav";

const Logout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(true);

  useEffect(() => {
    const performLogout = async () => {
      try {
        // Optionally, call to server to invalidate session
        // await logoutAPI();

        // Clear user context
        logout();
        setIsLoggingOut(false);

        // Alternatively, use navigate to redirect
        navigate("/login");
      } catch (error) {
        console.error("Logout failed:", error);
        setIsLoggingOut(false);
      }
    };

    performLogout();
  }, [logout, navigate]);

  if (isLoggingOut) {
    return (
      <div className="LiveSpace">
        <Nav />
        <div className="loading-container">
          <img src={logo} alt="MOCRS Logo" className="LiveSpace-loading" />
          <p className="loading">Loading space...</p>
          <small className="loading-notify">Just a moment...</small>
        </div>
      </div>
    );
  }

  return null;
};

export default Logout;
