// App.jsx
import { BrowserRouter } from "react-router-dom";
import "./App.css";
import AllRoutes from "../AllRoutes";
import { AuthProvider } from "../AuthProvider";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AllRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
