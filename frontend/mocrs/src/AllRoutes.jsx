// AllRoutes.jsx

import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./components/Home";
import SpaceList from "./components/SpaceList";
import NewSpaceForm from "./components/NewSpaceForm";
import LiveSpace from "./components/LiveSpace";
import LoginForm from "./components/LoginForm";
import SignUpForm from "./components/SignUpForm";
import Profile from "./components/Profile";
import Logout from "./components/Logout";
import ProtectedRoute from "./components/ProtectedRoute";

const AllRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/spaces" element={<SpaceList />} />
        <Route path="/spaces/:id" element={<LiveSpace />} />
        <Route
          path="/new-space"
          element={
            <ProtectedRoute>
              <NewSpaceForm />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignUpForm />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="/logout" element={<Logout />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
};

export default AllRoutes;
