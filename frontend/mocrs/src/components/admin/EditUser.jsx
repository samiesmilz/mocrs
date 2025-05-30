// frontend/mocrs/src/components/admin/EditUser.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserByUsername, adminUpdateUser } from '../../services/api'; // Corrected path
import './EditUser.css'; // Create this file for basic styling

const EditUser = () => {
  const { username } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    isAdmin: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        setSuccessMessage('');
        setError(null);
        const response = await getUserByUsername(username);
        const userData = response.data.user;
        setFormData({
          email: userData.email || '',
          // Backend returns first_name, last_name, is_admin
          firstName: userData.first_name || userData.firstName || '',
          lastName: userData.last_name || userData.lastName || '',
          isAdmin: userData.is_admin || userData.isAdmin || false,
        });
      } catch (err) {
        console.error(`Error fetching user ${username}:`, err);
        setError(err.response?.data?.error || `Failed to fetch user data for ${username}.`);
      } finally {
        setIsLoading(false);
      }
    };

    if (username) {
      fetchUserData();
    }
  }, [username]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear messages on change
    setSuccessMessage('');
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage('');
    setError(null);

    // Prepare data for PATCH request, only send fields that can be updated
    // Backend schema for update expects: firstName, lastName, email, isAdmin (password optional)
    // We are not updating password here for admin edits of other users.
    const updateData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      isAdmin: formData.isAdmin,
    };

    try {
      await adminUpdateUser(username, updateData);
      setSuccessMessage('User profile updated successfully!');
      // Optionally navigate back to user list after a delay
      setTimeout(() => navigate('/admin/users'), 2000);
    } catch (err) {
      console.error(`Error updating user ${username}:`, err);
      setError(err.response?.data?.error || `Failed to update user ${username}.`);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !formData.email) { // Show loading only if initial data hasn't been loaded
    return (
      <div className="edit-user-container">
        <p>Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="edit-user-container">
      <h1>Edit User: {username}</h1>
      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>
        <div className="form-group form-group-checkbox">
          <label htmlFor="isAdmin">Is Admin:</label>
          <input
            type="checkbox"
            id="isAdmin"
            name="isAdmin"
            checked={formData.isAdmin}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>
        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? 'Updating...' : 'Update Profile'}
        </button>
        <button type="button" className="back-button" onClick={() => navigate('/admin/users')} disabled={isLoading}>
          Back to User List
        </button>
      </form>
    </div>
  );
};

export default EditUser;
