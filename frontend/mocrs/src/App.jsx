// App.jsx
import { BrowserRouter } from "react-router-dom";
import "./App.css";
import AllRoutes from "./components/AllRoutes";
import { AuthProvider } from "./components/AuthProvider";

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
