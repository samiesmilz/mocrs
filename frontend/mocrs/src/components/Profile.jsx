import { useState, useContext, useEffect } from "react";
import "./Profile.css";
import { updateUser } from "../services/api";
import AuthContext from "./AuthContext";
import Nav from "../components/Nav";

const Profile = () => {
  const { setUserInContext, mocrsLocalUser, setMocrsLocalUser } =
    useContext(AuthContext);
  const [locked, setLocked] = useState(true);

  // Handling form data
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    confirmPassword: "",
    email: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (mocrsLocalUser && mocrsLocalUser.username) {
          console.log(`Mocrs profile for: ${mocrsLocalUser.username}`);
          setFormData({
            username: mocrsLocalUser.username,
            firstName: mocrsLocalUser.firstName,
            lastName: mocrsLocalUser.lastName,
            email: mocrsLocalUser.email,
            password: "",
            confirmPassword: "",
          });
          setLocked(true);
          return;
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };
    // Fetch user data
    fetchUserData();
  }, [mocrsLocalUser]);

  const unLock = (e) => {
    e.preventDefault();
    setLocked(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = "Username is required.";
    if (!formData.email) newErrors.email = "Email is required.";
    if (!formData.firstName) newErrors.firstName = "First Name is required.";
    if (!formData.lastName) newErrors.lastName = "Last Name is required.";
    if (!formData.password) newErrors.password = "Invalid password.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length === 0) {
      console.log("Form submitted successfully");
      try {
        const userData = { ...formData };
        delete userData.username;
        delete userData.confirmPassword;

        // Check data
        console.log(formData.username);
        console.log(userData);

        const updatedUser = await updateUser(formData.username, userData);
        console.log(updatedUser);
        setUserInContext(updatedUser);
        setMocrsLocalUser(updatedUser);
        setLocked(true); // Lock the form again after successful update
        console.log("Profile updated successfully.");
      } catch (error) {
        console.error("Error updating profile:", error);
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
              placeholder="username"
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
              autoComplete="firstname"
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
              autoComplete="lastname"
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
              placeholder="password"
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
