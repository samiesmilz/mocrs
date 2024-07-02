// Profile
import { useState, useEffect } from "react";
import "./Profile.css";
import { updateUser, deleteUser } from "../services/api";
import { useAuth } from "./useAuth";
import Nav from "./Nav";
import { useNavigate } from "react-router-dom";
import logo from "../assets/mocrs.gif";

const Profile = () => {
  const navigate = useNavigate();
  const { mocrsUser, login, logout, isLoading, token } = useAuth();
  const [locked, setLocked] = useState(true);
  const initialData = {
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    password: "",
  };
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && mocrsUser) {
      // If mocrsUser has a user key, use it, otherwise use mocrsUser directly
      const userData = mocrsUser.user
        ? { ...mocrsUser.user, token: mocrsUser.token }
        : mocrsUser;

      setFormData({ ...userData, password: "" });
      setErrors({});
      setLocked(true);
    }
  }, [isLoading, mocrsUser]);

  const unLock = (e) => {
    e.preventDefault();
    setLocked(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "", submit: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required.";
    if (!formData.firstName) newErrors.firstName = "First Name is required.";
    if (!formData.lastName) newErrors.lastName = "Last Name is required.";
    if (!formData.password) newErrors.password = "Password is required.";
    if (formData.password && formData.password.length < 3) {
      newErrors.password = "Password must be at least 3 characters long.";
    }
    return newErrors;
  };

  // handle submit in profile to update user
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      try {
        const userData = {
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          password: formData.password,
        };
        const response = await updateUser(formData.username, userData);
        let updatedUser = response.data;

        // Ensure the token is included in the user object and the structure is consistent
        if (updatedUser.user) {
          updatedUser = { ...updatedUser.user, token: updatedUser.token };
        } else {
          updatedUser = { ...updatedUser, token };
        }

        login(updatedUser, token);

        setLocked(true);
        console.log("Profile updated successfully.");
      } catch (error) {
        setErrors({ submit: "Failed to update profile. Please try again." });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setErrors(newErrors);
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      await deleteUser(formData?.username);
      logout();
      console.log("Profile deleted successfully.");
      navigate("/signup");
    } catch (error) {
      console.error("Error deleting profile:", error);
      setErrors({ submit: "Failed to delete account. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="LiveSpace">
        <Nav />
        <div className="loading-container">
          <img src={logo} alt="MOCRS Logo" className="LiveSpace-loading" />
          <p className="loading">Loading space...</p>
          <small className="loading-notify">Just a moment...</small>
        </div>
      </div>
    );
  }

  if (!mocrsUser) {
    return (
      <div className="Profile-Div">
        <Nav />
        <div className="Profile-wrapper-div">
          <div className="Profile">
            <h3 className="Profile-heading">
              Hi there, this could be your profile. 🐶
            </h3>
            <img src={logo} alt="MOCRS Logo" className="Profile-logo-guest" />
            <button
              onClick={() => navigate("/signup")}
              className="Profile-join"
            >
              Claim Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="Profile-Div">
      <Nav />
      <div className="Profile-wrapper-div">
        <h1 className="Profile-welcome">Hi, {formData?.firstName}</h1>

        <form className="Profile">
          <div>
            <h5 className="Profile-heading">
              Manage your account
              <button
                onClick={unLock}
                className="Profile-unlock"
                type="button"
                disabled={isSubmitting}
              >
                Edit profile
              </button>
            </h5>
          </div>

          <div>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              autoComplete="username"
              disabled
            />
          </div>

          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              autoComplete="email"
              onChange={handleChange}
              disabled={locked || isSubmitting}
            />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              autoComplete="given-name"
              onChange={handleChange}
              disabled={locked || isSubmitting}
            />
            {errors.firstName && <p className="error">{errors.firstName}</p>}
          </div>

          <div>
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              autoComplete="family-name"
              onChange={handleChange}
              disabled={locked || isSubmitting}
            />
            {errors.lastName && <p className="error">{errors.lastName}</p>}
          </div>

          <div>
            <label htmlFor="password">Password (required for update)</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              autoComplete="current-password"
              onChange={handleChange}
              disabled={locked || isSubmitting}
            />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>

          {errors.submit && <p className="error">{errors.submit}</p>}

          <button
            type="submit"
            className="Profile-submit"
            disabled={locked || isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting ? "Updating..." : "Update Profile"}
          </button>
        </form>
        <small className="Profile-delete-warning">
          This action cannot be undone.
        </small>
        <button
          className="Profile-delete"
          onClick={handleDelete}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Deleting..." : "Delete your account 😬⛔️🚮"}
        </button>
      </div>
    </div>
  );
};

export default Profile;
