// Space.jsx
import PropTypes from "prop-types";
import "./Space.css";

const Space = ({ room }) => {
  return (
    <div className="Space">
      <h4 className="Space-title">Space Name: {room.name}</h4>
      <p>{room.participants}: participants</p>
      <p>Description: {room.description}</p>
      <p>Tags: #newroom</p>
      <div>
        <button className="Join-space">Join space</button>
      </div>
    </div>
  );
};

Space.propTypes = {
  room: PropTypes.shape({
    name: PropTypes.string.isRequired,
    participants: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
};

export default Space;
