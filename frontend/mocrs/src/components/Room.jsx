import "react";
import "./Room.css";
const Room = () => {
  return (
    <div className="Room">
      <h4 className="Space-title">Space Name: Curious ones</h4>
      <p>{0}: participants</p>
      <p>Topic: {"Topic goes here.."}</p>
      <p>Tags: #newroom</p>
      <div>
        <button className="Join-space">Join space</button>
      </div>
    </div>
  );
};
export default Room;
