// AllRoutes.jsx

import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./home/Home";
import SpaceList from "./spacelist/SpaceList";
import NewSpaceForm from "./newspace/NewSpaceForm";
import LiveSpace from "./livespace/LiveSpace";
import LoginForm from "./login/LoginForm";
import SignUpForm from "./signup/SignUpForm";
import Profile from "./profile/Profile";
import Logout from "./logout/Logout";
import ProtectedRoute from "./protectedroute/ProtectedRoute";
import ManageSpace from "./managespace/ManageSpace";

// Admin imports
import AdminProtectedRoute from "./adminprotectedroute/AdminProtectedRoute";
import UserList from "./admin/UserList"; // Placeholder
import EditUser from "./admin/EditUser"; // Placeholder

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

        {/* Admin Routes */}
        <Route
          path="/admin/users"
          element={
            <AdminProtectedRoute>
              <UserList />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/users/:username/edit"
          element={
            <AdminProtectedRoute>
              <EditUser />
            </AdminProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
};

export default AllRoutes;
