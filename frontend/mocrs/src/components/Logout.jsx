import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "./AuthContext";

const Logout = () => {
  const { setUserInContext, setMocrsLocalUser, setMocrsAuthToken } =
    useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Clear user context
    setMocrsLocalUser(null);
    setUserInContext(null);
    setMocrsAuthToken(null);

    navigate("/login");
  }, [navigate, setUserInContext, setMocrsLocalUser, setMocrsAuthToken]);

  return null;
};

export default Logout;
