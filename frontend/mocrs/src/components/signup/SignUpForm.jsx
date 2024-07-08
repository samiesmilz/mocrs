import { useState } from "react";
import "./SignUpForm.css";
import { registerUser } from "../../services/api";
import { useNavigate, Link } from "react-router-dom";
import Nav from "../nav/Nav";
import { useAuth } from "../useAuth";

const SignUpForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
  });

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "password") setPassword(value);
    else if (name === "confirmPassword") setConfirmPassword(value);
    else setFormData((data) => ({ ...data, [name]: value }));
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = "Username is required.";
    if (!formData.email) newErrors.email = "Email is required.";
    return newErrors;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = "First Name is required.";
    if (!formData.lastName) newErrors.lastName = "Last Name is required.";
    if (!password || password.length < 5)
      newErrors.password =
        "Valid password required - must be at least 5 characters.";
    if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentStep === 1) {
      const newErrors = validateStep1();
      if (Object.keys(newErrors).length === 0) {
        setCurrentStep(2);
      } else {
        setErrors(newErrors);
      }
    } else if (currentStep === 2) {
      const newErrors = validateStep2();

      if (Object.keys(newErrors).length === 0) {
        try {
          const userData = { ...formData, password };
          delete userData.confirmPassword;
          const response = await registerUser(userData);
          const { newUser, token } = response.data;

          if (newUser && token) {
            console.log(`Current user: ${newUser.username}`);
            // Set user and token in context and local storage
            const user = { ...newUser, token };
            login(user, token);

            // Navigate to the desired page
            navigate("/spaces");
          }
          // Reset form data
          setFormData({
            username: "",
            firstName: "",
            lastName: "",
            email: "",
          });
        } catch (error) {
          console.error("Sign up failed:", error);
          setErrors({ confirmPassword: error.response.data.error.message });
        }
      } else {
        setErrors(newErrors);
      }
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  return (
    <div className="SignUpForm-Div">
      <Nav />
      <div className="SignUpForm-wrapper-div">
        <h4 className="SignUpForm-title">Join Mocrs - Live Spaces...</h4>
        <div className="SignUpForm-progress">
          <div
            className={`SignUpForm-step ${currentStep === 1 ? "active" : ""}`}
          >
            Step 1
          </div>
          <div
            className={`SignUpForm-step ${currentStep === 2 ? "active" : ""}`}
          >
            Step 2
          </div>
        </div>
        <form onSubmit={handleSubmit} className="SignUpForm">
          {currentStep === 1 && (
            <>
              <h5 className="SignUpForm-heading">
                Step 1: Account Information
              </h5>
              <div className="SignUpForm-input-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Username"
                  autoComplete="username"
                  value={formData.username}
                  onChange={handleChange}
                />
                {errors.username && <p className="error">{errors.username}</p>}
              </div>

              <div className="SignUpForm-input-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <p className="error">{errors.email}</p>}
              </div>

              <button type="submit" className="SignUpForm-next-button">
                Next
              </button>
            </>
          )}

          {currentStep === 2 && (
            <>
              <h5 className="SignUpForm-heading">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="SignUpForm-back-button"
                >
                  ⇠ Previous
                </button>
                Step 2: Profile Information
              </h5>
              <div className="SignUpForm-input-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  placeholder="First Name"
                  autoComplete="firstname"
                  value={formData.firstName}
                  onChange={handleChange}
                />
                {errors.firstName && (
                  <p className="error">{errors.firstName}</p>
                )}
              </div>

              <div className="SignUpForm-input-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  placeholder="Last Name"
                  autoComplete="lastname"
                  value={formData.lastName}
                  onChange={handleChange}
                />
                {errors.lastName && <p className="error">{errors.lastName}</p>}
              </div>

              <div className="SignUpForm-input-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Password"
                  autoComplete="new-password"
                  value={password}
                  onChange={handleChange}
                />
                {errors.password && <p className="error">{errors.password}</p>}
              </div>

              <div className="SignUpForm-input-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={handleChange}
                />
                {errors.confirmPassword && (
                  <p className="error">{errors.confirmPassword}</p>
                )}
              </div>
              <div className="SignUpForm-button-group">
                <button type="submit" className="SignUpForm-signup-button">
                  Sign Up
                </button>
              </div>
            </>
          )}
          <p className="SignUpForm-register-link">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUpForm;
