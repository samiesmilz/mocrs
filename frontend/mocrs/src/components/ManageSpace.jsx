// NewSpaceForm.jsx

import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { updateRoom, deleteRoom } from "../services/api";
import { useAuth } from "./useAuth";
import Nav from "../components/Nav";
import "./ManageSpace.css";
import logo from "../assets/mocrs.gif";

const ManageSpace = () => {
  const location = useLocation();
  const { room } = location.state || {};
  const { mocrsUser, token } = useAuth();
  const navigate = useNavigate();
  const initialData = {
    name: room?.name || "",
    description: room?.description || "",
    room_type: room?.room_type || "meeting",
    is_private: room?.is_private || false,
  };
  const [formData, setFormData] = useState(initialData);
  const [error, setError] = useState(null);
  const [locked, setLocked] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((data) => ({
      ...data,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  // Hadle submitting form data
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.description) {
      setError("Name and description are required");
      return;
    }
    try {
      const response = await updateRoom(room.id, formData);
      setFormData(response.data);
      setLocked(true);
      console.log("Room updated successfully 🎉");
    } catch (error) {
      console.error("Error updating room:", error);
      setError("Sorry, failed to update room.");
    }
  };

  const unLock = (e) => {
    e.preventDefault();
    setLocked(false);
    setIsSubmitting(false);
  };

  const handleClick = () => {
    navigate("/login");
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      const response = await deleteRoom(room.id);
      console.log(`Room ${response.data} deleted successfully 🎉`);
      navigate("/profile");
    } catch (error) {
      console.error("Error deleting room:", error);
      setError("Sorry, failed to delete room."); // Set error as a string
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mocrsUser || !token) {
    return (
      <div className="LiveSpace">
        <Nav />
        <div className="loading-container">
          <img src={logo} alt="MOCRS Logo" className="LiveSpace-loading" />
          <p className="loading">Join the conversation...</p>
          <p className="loading-notify">
            Please 👉🏼{" "}
            <button onClick={handleClick} className="loading-login">
              login/signup
            </button>{" "}
            to instally access rooms. 🎉
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="ManageSpace-Div">
      <Nav className="Nav" />
      <div className="ManageSpace-div">
        <form className="Update-room-form">
          <h2 className="ManageSpace-title">
            ⚙️ Manage your space
            <button
              onClick={unLock}
              className="ManageSpace-unlock"
              type="button"
              disabled={isSubmitting}
            >
              Unlock to edit room.
            </button>
          </h2>
          {error && <p className="ManageSpace-error-message">{error}</p>}
          <input
            type="text"
            name="name"
            placeholder="Room Name"
            value={formData.name}
            onChange={handleChange}
            disabled={locked || isSubmitting}
            required
            maxLength={255}
            className="ManageSpace-name"
          />
          <textarea
            name="description"
            placeholder="Room Description"
            value={formData.description}
            onChange={handleChange}
            disabled={locked || isSubmitting}
            required
            maxLength={220}
          />
          <select
            name="room_type"
            value={formData.room_type}
            onChange={handleChange}
            disabled={locked || isSubmitting}
          >
            <option value="meeting">Meeting</option>
            <option value="social">Social</option>
            <option value="study">Study</option>
            <option value="stream">Stream</option>
            <option value="focus">Focus</option>
            <option value="chat">Chat</option>
          </select>
          <label className="ManageSpace-checkbox">
            <input
              type="checkbox"
              name="is_private"
              checked={formData.is_private}
              onChange={handleChange}
              disabled={locked || isSubmitting}
              className="ManageSpace-checkbox"
            />
            <span className="ManageSpace-checkbox-text">Private Space</span>
          </label>
          <button
            type="submit"
            disabled={locked || isSubmitting}
            className="ManageSpace-update-btn"
            onClick={handleSubmit}
          >
            {isSubmitting ? "Updating..." : "Update Space"}
          </button>
        </form>
        <div>
          <p className="Space-delete-warning">
            This action cannot be undone 😬
          </p>
          <button
            className="Space-delete"
            onClick={handleDelete}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Delete this space 🔥"}
          </button>
          <p className="Space-see-ya">
            <small>{"See ya' never 🫧"}</small>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ManageSpace;
