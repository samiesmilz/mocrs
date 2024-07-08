import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../useAuth";
import PropTypes from "prop-types";
import "./ProtectedRoute.css";
import Nav from "../nav/Nav";
import logo from "../../assets/mocrs.gif";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const handleClick = () => {
    navigate("/login");
  };

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
    return (
      <div className="LiveSpace">
        <Nav />
        <div className="loading-container">
          <img src={logo} alt="MOCRS Logo" className="LiveSpace-loading" />
          <p className="loading">Join the conversation...</p>
          <p className="loading-notify">
            Please 👉🏼{" "}
            <button onClick={handleClick} className="loading-login">
              login/signup
            </button>{" "}
            to instally access rooms. 🎉
          </p>
        </div>
      </div>
    );
  }

  return children; // Render protected content if authenticated
};

ProtectedRoute.propTypes = {
  children: PropTypes.element.isRequired,
};

export default ProtectedRoute;
