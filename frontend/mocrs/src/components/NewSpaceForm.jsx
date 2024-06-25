// NewSpaceForm.jsx

import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { createRoom } from "../services/api";
import AuthContext from "./AuthContext";
import Nav from "../components/Nav";
import "./NewSpaceForm.css";

const NewSpaceForm = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    room_type: "meeting",
    is_private: false,
    creator_id: user.id,
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((data) => ({
      ...data,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.description) {
      setError("Name and description are required");
      return;
    }

    try {
      const response = await createRoom(formData);
      navigate(`/spaces/${response.data.uuid}`);
    } catch (error) {
      console.error("Error creating room:", error);
      setError("Failed to create room. Please try again.");
    }
  };

  return (
    <div className="NewSpace-Div">
      <Nav className="Nav" />
      <div className="NewSpaceForm-div">
        <form className="create-room-form" onSubmit={handleSubmit}>
          <h2>Create new space</h2>
          {error && <p className="error-message">{error}</p>}
          <input
            type="text"
            name="name"
            placeholder="Room Name"
            value={formData.name}
            onChange={handleChange}
            required
            maxLength={255}
            className="NewSpaceForm-name"
          />
          <textarea
            name="description"
            placeholder="Room Description"
            value={formData.description}
            onChange={handleChange}
            required
            maxLength={250}
          />
          <select
            name="room_type"
            value={formData.room_type}
            onChange={handleChange}
          >
            <option value="meeting">Meeting</option>
            <option value="study">Study</option>
            <option value="focus">Focus</option>
            <option value="chat">Chat</option>
          </select>
          <label className="NewSpaceForm-checkbox">
            <input
              type="checkbox"
              name="is_private"
              checked={formData.is_private}
              onChange={handleChange}
              className="Form-checkbox"
            />
            <span className="Form-checkbox-text">Private Space</span>
          </label>
          <button type="submit">Create new space</button>
        </form>
      </div>
    </div>
  );
};

export default NewSpaceForm;
