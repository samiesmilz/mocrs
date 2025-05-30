import { useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../useAuth";
import PropTypes from "prop-types";
import Nav from "../nav/Nav"; // Assuming Nav should be shown on loading/error
import logo from "../../assets/mocrs.gif"; // For loading indicator

// Basic CSS, create AdminProtectedRoute.css if more specific styles are needed later
// For now, you can reuse some class names from ProtectedRoute.css if they are generic enough
// import "./AdminProtectedRoute.css";

const AdminProtectedRoute = ({ children }) => {
  const { mocrsUser, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
    // If authenticated but not admin, navigate away (e.g., to home)
    // This useEffect might cause issues if mocrsUser is briefly null during auth flow.
    // The direct rendering logic below is often more robust for conditional redirects.
  }, [isAuthenticated, isLoading, mocrsUser, navigate]);

  if (isLoading) {
    return (
      // Assuming a similar loading structure as ProtectedRoute
      <div className="ProtectedRoute-loading"> {/* Or a new specific class */}
        <Nav />
        <div className="loading-container">
          <img src={logo} alt="MOCRS Logo" className="LiveSpace-loading" />
          <p className="loading">Loading Admin Area...</p>
          <small className="loading-notify">Verifying permissions...</small>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  if (!mocrsUser || !mocrsUser.isAdmin) {
    // Redirect to home if authenticated but not an admin
    // Or show an "Unauthorized" component/page
    return <Navigate to="/" replace />;
  }

  return children; // Render protected content if authenticated and admin
};

AdminProtectedRoute.propTypes = {
  children: PropTypes.element.isRequired,
};

export default AdminProtectedRoute;
