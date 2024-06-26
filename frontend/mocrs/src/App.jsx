// App.jsx
import { useState, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import "./App.css";
import AllRoutes from "./AllRoutes";
import AuthContext from "./components/AuthContext";
import useLocalStorage from "./hooks/useLocalStorage";

function App() {
  const [user, setUserInContext] = useState(null);
  const [mocrsAuthToken, setMocrsAuthToken] = useLocalStorage(
    "mocrsAuthToken",
    null
  );
  const [mocrsLocalUser, setMocrsLocalUser] = useLocalStorage(
    "mocrsLocalUser",
    null
  );

  useEffect(() => {
    if (mocrsLocalUser) {
      setUserInContext(mocrsLocalUser);
    }
  }, [mocrsLocalUser]);

  return (
    <>
      <BrowserRouter>
        <AuthContext.Provider
          value={{
            user,
            setUserInContext,
            mocrsLocalUser,
            setMocrsLocalUser,
            mocrsAuthToken,
            setMocrsAuthToken,
          }}
        >
          <AllRoutes />
        </AuthContext.Provider>
      </BrowserRouter>
    </>
  );
}

export default App;
