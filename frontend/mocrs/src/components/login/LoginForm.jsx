import { useState } from "react";
import "./LoginForm.css";
import { loginUser } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../useAuth";
import Nav from "../nav/Nav";

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const initialData = {
    username: "",
    password: "",
  };
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = "Username is required.";
    if (!formData.password) newErrors.password = "Password is required.";
    return newErrors;
  };

  // handle submit in login form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await loginUser(formData); // Make the login API call
        let { user, token } = response.data; // Destructure the response

        if (user && token) {
          console.log(`Current user: ${user.username}`);
          // Set user and token in context and local storage
          user = { ...user, token: token };
          login(user, token);
          // navigate to the desired page
          navigate("/spaces");
        }

        // Reset form data
        setFormData(initialData);
      } catch (error) {
        console.error("Login failed:", error);
        setErrors({ password: "Oops: Invalid username/password!" });
      }
    } else {
      setErrors(newErrors);
    }
  };

  const handleRegister = () => {
    navigate("/signup");
  };

  return (
    <div className="LoginForm-Div">
      <Nav />
      <div className="LoginForm-wrapper-div">
        <h3 className="LoginForm-title">Welcome to Mocrs 🎉</h3>
        <form onSubmit={handleSubmit} className="LoginForm">
          <div>
            <h5 className="LoginForm-heading">
              Sign in to explore live spaces.
            </h5>
          </div>
          {errors.username && <p className="error">{errors.username}</p>}
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
              required
              maxLength={255}
            />
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
              required
            />
            {errors.password && <p className="error">{errors.password} 🫤</p>}
          </div>

          <button type="submit">Login</button>
        </form>
        <p className="LoginForm-register-link">
          Dont have an account yet 🤔
          <button className="signup-hatch" onClick={handleRegister}>
            🏃🏻‍♀️‍➡️ Register here 🚀
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
