import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllRooms } from "../services/api";
import Space from "../components/Space";
import Nav from "../components/Nav";
import AuthContext from "./AuthContext";
import logo from "../assets/mocrs.gif";
import "./SpaceList.css";

const SpaceList = () => {
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await getAllRooms();
        setRooms(response.data || []); // Ensure response.data is set or default to empty array
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };
    fetchRooms();
  }, []);

  const handleGetStarted = () => {
    navigate("/signup");
  };

  return (
    <div className="SpaceList">
      <Nav />
      <h2 className="SpaceList-title">
        <span className="SpaceList-user-firstname">
          Hi {user && user.firstName}
        </span>
        , Join live spaces...
        {!user && (
          <button className="Get-started" onClick={handleGetStarted}>
            Get started here - for free 🎉
          </button>
        )}
      </h2>
      <div className="SpacesList-spaces">
        {rooms.length ? (
          rooms.map((space) => (
            <Link
              to={`/spaces/${space.uuid}`}
              key={space.id}
              className="Space-card"
            >
              <Space room={space} />
            </Link>
          ))
        ) : (
          <div className="SpaceList-loading">
            <Nav />
            <div className="loading-container">
              <img src={logo} alt="MOCRS Logo" className="LiveSpace-loading" />
              <p className="loading">Loading space...</p>
              <small className="loading-notify">Just a moment...</small>
            </div>
          </div>
        )}
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
