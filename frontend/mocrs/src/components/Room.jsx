import "react";
import "./Room.css";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
const Room = ({ room }) => {
  return (
    <div className="Room">
      <h4 className="Space-title">Space Name: {room.name}</h4>
      <p>{room.participants}: participants</p>
      <p>
        Description:{" "}
        {room.description.substring(0, 140) +
          (room.description.length > 140 ? "..." : "")}
      </p>
      <p>Tags: #newroom</p>
      <div>
        <Link to={`/spaces/${room.uuid}`} className="Space-card">
          <button className="Join-space">Join space</button>
        </Link>
        <Link to={`/manage/${room.id}`} state={{ room }} className="Space-card">
          <button className="Manage-space">Manage space</button>
        </Link>
      </div>
    </div>
  );
};
Room.propTypes = {
  room: PropTypes.shape({
    id: PropTypes.number.isRequired,
    uuid: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    participants: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
};
export default Room;
