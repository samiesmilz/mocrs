// AllRoutes.jsx

import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./Home";
import SpaceList from "./SpaceList";
import NewSpaceForm from "./NewSpaceForm";
import LiveSpace from "./LiveSpace";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";
import Profile from "./Profile";
import Logout from "./Logout";
import ProtectedRoute from "./ProtectedRoute";
import ManageSpace from "./ManageSpace";

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
        <Route path="/profile" element={<Profile />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/manage/:id" element={<ManageSpace />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
};

export default AllRoutes;
