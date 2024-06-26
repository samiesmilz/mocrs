import { useState, useContext, useEffect } from "react";
import "./Profile.css";
import { updateUser } from "../services/api";
import AuthContext from "./AuthContext";
import Nav from "../components/Nav";

const Profile = () => {
  const {
    user,
    setUserInContext,
    mocrsLocalUser,
    setMocrsLocalUser,
    setMocrsAuthToken,
  } = useContext(AuthContext);
  const [locked, setLocked] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (mocrsLocalUser && mocrsLocalUser.username) {
          const { username, firstName, lastName, email } = mocrsLocalUser;
          setFormData({
            username,
            firstName,
            lastName,
            email,
            password: "",
            confirmPassword: "",
          });
          setLocked(true);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };
    fetchUserData();
  }, [mocrsLocalUser]);

  const unLock = (e) => {
    e.preventDefault();
    setLocked(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = "Username is required.";
    if (!formData.email) newErrors.email = "Email is required.";
    if (!formData.firstName) newErrors.firstName = "First Name is required.";
    if (!formData.lastName) newErrors.lastName = "Last Name is required.";
    if (!formData.password) newErrors.password = "Password is required.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length === 0) {
      try {
        setMocrsAuthToken(user.token);
        const userData = { ...formData };
        delete userData.username;
        delete userData.confirmPassword;
        // Send form data to server
        const updatedUser = await updateUser(mocrsLocalUser.username, userData);
        setUserInContext(updatedUser);
        setMocrsLocalUser(updatedUser);
        setLocked(true);
        console.log("Profile updated successfully.");
      } catch (error) {
        console.error("Error updating profile:", error);
        // Handle error state or display error message to user
      }
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="Profile-Div">
      <Nav />
      <div className="Profile-wrapper-div">
        <h1 className="Profile-welcome">Hi, {formData.firstName}.</h1>

        <form className="Profile" onSubmit={handleSubmit}>
          <div>
            <h5 className="Profile-heading">
              Manage your account
              <button onClick={unLock} className="Profile-unlock">
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
              placeholder="Username"
              autoComplete="username"
              value={formData.username}
              onChange={handleChange}
              disabled
            />
            {errors.username && <p className="error">{errors.username}</p>}
          </div>

          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              disabled={locked}
            />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              placeholder="First name"
              autoComplete="given-name"
              value={formData.firstName}
              onChange={handleChange}
              disabled={locked}
            />
            {errors.firstName && <p className="error">{errors.firstName}</p>}
          </div>

          <div>
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              placeholder="Last name"
              autoComplete="family-name"
              value={formData.lastName}
              onChange={handleChange}
              disabled={locked}
            />
            {errors.lastName && <p className="error">{errors.lastName}</p>}
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              disabled={locked}
            />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>

          <button type="submit" className="Profile-submit" disabled={locked}>
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
