import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "./AuthContext";
import PropTypes from "prop-types";
import "./ProtectedRoute.css";
import Nav from "./Nav";
import logo from "../assets/mocrs.gif";

const ProtectedRoute = ({ children }) => {
  const { user, mocrsLocalUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user || mocrsLocalUser) {
      setIsAuthenticated(true);
    }
    setIsLoading(false); // Mark loading as false once authentication status is determined
  }, [user, mocrsLocalUser]);

  if (isLoading) {
    return (
      <div className="ProtectedRoute-loading">
        <Nav />
        <div className="loading-container">
          <img src={logo} alt="MOCRS Logo" className="LiveSpace-loading" />
          <p className="loading">Loading space...</p>
          <small className="loading-notify">Just a moment...</small>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    navigate("/login"); // Navigate to login page if not authenticated
    return null; // Optional: Return null or loading indicator while redirecting
  }

  return children; // Render protected content if authenticated
};

ProtectedRoute.propTypes = {
  children: PropTypes.element.isRequired,
};

export default ProtectedRoute;
