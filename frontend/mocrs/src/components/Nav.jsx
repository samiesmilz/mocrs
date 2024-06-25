import { Link } from "react-router-dom";
import navlogo from "../assets/nav-logo.gif";
import { useContext } from "react";
import AuthContext from "./AuthContext";

import "./Nav.css";
const Nav = () => {
  const { user } = useContext(AuthContext);
  return (
    <nav className="Nav">
      <Link to="/">
        <img src={navlogo} alt="mocrs logo" className="Nav-logo" />
      </Link>
      <div className="Nav-links">
        <Link to="/spaces">Spaces</Link>

        {user !== null ? (
          <>
            <Link to="/new-space" className="Nav-create-space">
              Create space
            </Link>
            <Link to="/logout" className="Nav-logout">
              Logout
            </Link>
          </>
        ) : (
          <>
            <Link to="/login" className="Nav-login-link">
              Login
            </Link>
            <Link to="/signup" className="Nav-signup-link">
              Signup
            </Link>
          </>
        )}
        <Link to="/profile" className="Nav-profile-link">
          ☻
        </Link>
      </div>
    </nav>
  );
};
export default Nav;
