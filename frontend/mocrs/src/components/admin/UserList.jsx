// frontend/mocrs/src/components/admin/UserList.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllUsers, adminDeleteUser } from '../../services/api'; // Corrected path
import { useAuth } from '../useAuth'; // To get current admin user for context if needed
import './UserList.css'; // Create this file for basic styling

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { mocrsUser } = useAuth(); // Get current user, e.g., to prevent admin from deleting self easily

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await getAllUsers();
        // The backend returns { users: [...] }, so access response.data.users
        setUsers(response.data.users || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError(err.response?.data?.error || 'Failed to fetch users. You may not have administrator privileges or the server is down.');
        setUsers([]); // Clear users on error
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDeleteUser = async (usernameToDelete) => {
    if (usernameToDelete === mocrsUser?.username) {
      alert("Admins cannot delete themselves through this interface.");
      return;
    }
    if (window.confirm(`Are you sure you want to delete user: ${usernameToDelete}? This action cannot be undone.`)) {
      try {
        await adminDeleteUser(usernameToDelete);
        setUsers(users.filter(user => user.username !== usernameToDelete));
        alert(`User ${usernameToDelete} deleted successfully.`);
      } catch (err) {
        console.error("Error deleting user:", err);
        alert(`Failed to delete user ${usernameToDelete}.`);
        // Potentially update error state: setError(err.response?.data?.error || 'Failed to delete user.');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="user-list-container">
        <p>Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-list-container error-message">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="user-list-container">
      <h1>Admin User Management</h1>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Admin?</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.username}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.first_name || user.firstName || 'N/A'}</td>
                <td>{user.last_name || user.lastName || 'N/A'}</td>
                <td>{user.is_admin || user.isAdmin ? 'Yes' : 'No'}</td>
                <td>
                  <Link to={`/admin/users/${user.username}/edit`} className="action-button edit-button">
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDeleteUser(user.username)}
                    className="action-button delete-button"
                    disabled={user.username === mocrsUser?.username} // Disable delete for self
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserList;
