import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllRooms } from "../services/api";
import Space from "./Space";
import Nav from "./Nav";
import { useAuth } from "./useAuth";
import logo from "../assets/mocrs.gif";
import "./SpaceList.css";

const SpaceList = () => {
  const { mocrsUser } = useAuth();
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setIsLoading(true);
        const response = await getAllRooms();
        const fetchedRooms = Array.isArray(response.data) ? response.data : [];
        setRooms(fetchedRooms);
        setError(null);
      } catch (error) {
        console.error("Error fetching rooms:", error);
        setError("Failed to fetch rooms.");
        setRooms([]); // Ensure rooms is always an array
      } finally {
        setIsLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const handleGetStarted = () => {
    navigate("/signup");
  };
  const handleEscape = () => {
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="SpaceList-loading">
        <Nav />
        <div className="loading-container">
          <img src={logo} alt="MOCRS Logo" className="LiveSpace-loading" />
          <p className="loading">Loading spaces...</p>
          <small className="loading-notify">Just a moment...</small>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="SpaceList">
        <Nav />
        <div className="error-container">
          <img src={logo} alt="MOCRS Logo" className="error-logo" />
          <div className="error-message">{error}</div>
          <p className="error-desc">Something strange happeded!</p>
          <button className="escape-hatch" onClick={handleEscape}>
            Here is your escape hatch 🚀
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="SpaceList">
      <Nav />
      <h2 className="SpaceList-title">
        <span className="SpaceList-user-firstname">
          Hi {mocrsUser && mocrsUser.firstName}
        </span>
        , Join live spaces...
        {!mocrsUser && (
          <button className="Get-started" onClick={handleGetStarted}>
            Get started here - for free 🎉
          </button>
        )}
      </h2>
      <div className="SpacesList-spaces">
        {rooms
          .filter((space) => !space.is_private)
          .map((space) => (
            <Link
              to={`/spaces/${space.uuid}`}
              key={space.id}
              className="Space-card"
            >
              <Space room={space} />
            </Link>
          ))}
      </div>
      <p className="SpaceList-footer-notification">
        There {rooms.length === 1 ? "is" : "are"}{" "}
        <span className="notify-span">{rooms.length} live </span>
        {rooms.length === 1 ? "space" : "spaces"} right now.
      </p>
      <p className="SpaceList-footer">Focus / learn / connect / meditate 💭</p>
    </div>
  );
};

export default SpaceList;
