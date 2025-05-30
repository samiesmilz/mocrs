import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../useAuth";
import { getRoom, createLiveKitToken } from "../../services/api"; // Import createLiveKitToken
import LiveKitRoom from "../livekitroom/LiveKitRoom";
import "./LiveSpace.css";
import Nav from "../nav/Nav";
import logo from "../../assets/mocrs.gif";

const LIVEKIT_SERVER_URL = import.meta.env.VITE_LIVEKIT_URL || "ws://localhost:7880"; // Get from .env

const LiveSpace = () => {
  const { mocrsUser } = useAuth(); // Contains user info like username, firstName
  const navigate = useNavigate();
  const { id: roomId } = useParams(); // Renamed id to roomId for clarity
  const [room, setRoom] = useState(null);
  const [error, setError] = useState(null);
  const [liveKitToken, setLiveKitToken] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRoomAndToken = async () => {
      if (!roomId) {
        setError("No Room ID provided.");
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        const roomResponse = await getRoom(roomId);
        const currentRoom = roomResponse.data;
        setRoom(currentRoom);

        if (!currentRoom) {
          setError("Room not found");
          setIsLoading(false);
          return;
        }

        // Prepare user info for LiveKit token
        // Identity should be unique for each user.
        // Name is the display name in the LiveKit room.
        const liveKitUserInfo = {
          identity: mocrsUser?.username || `guest-${Math.random().toString(36).substr(2, 5)}`,
          name: mocrsUser?.firstName || "Guest User"
        };

        // Determine if the current user is the creator, thus a moderator
        // Assuming currentRoom.creator_id and mocrsUser.id are available and comparable
        // This logic might need adjustment based on actual data structure for creator_id and user id
        const isModerator = mocrsUser && currentRoom.creator_id === mocrsUser.id;


        // Fetch LiveKit token
        const tokenResponse = await createLiveKitToken({
          roomName: currentRoom.name, // Use room name from fetched room details
          identity: liveKitUserInfo.identity,
          name: liveKitUserInfo.name,
          isModerator: isModerator // Pass moderator status
        });
        setLiveKitToken(tokenResponse.data.token);

      } catch (err) {
        console.error("Error fetching room or LiveKit token:", err);
        setError(
          err.response?.data?.message || "Failed to load room or token."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoomAndToken();
  }, [roomId, mocrsUser]); // mocrsUser is a dependency for token generation

  const handleMeetingEnd = useCallback(() => { // This might be triggered by LiveKitRoom later
    navigate("/spaces");
  }, [navigate]);

  const handleClickToLogin = () => {
    navigate("/login");
  };

  if (error) {
    // ... (error rendering - no change needed here)
    return (
      <div className="LiveSpace">
        <Nav />
        <div className="error-container">
          <img src={logo} alt="MOCRS Logo" className="error-logo" />
          <div className="error-message">{error}</div>
          <p className="error-desc">Failed to load the room.</p>
          <button className="escape-hatch" onClick={handleMeetingEnd}>
            Return to Spaces 🚀
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    // ... (loading rendering - no change needed here)
     return (
      <div className="LiveSpace">
        <Nav />
        <div className="loading-container">
          <img src={logo} alt="MOCRS Logo" className="LiveSpace-loading" />
          <p className="loading">Loading space...</p>
          <small className="loading-notify">Just a moment...</small>
        </div>
      </div>
    );
  }

  // If not logged in and no token (or room details) yet, prompt to login
  // This logic might need refinement based on when liveKitToken becomes available
  if (!mocrsUser && !liveKitToken) {
         return (
          <div className="LiveSpace">
            <Nav />
            <div className="loading-container">
              <img src={logo} alt="MOCRS Logo" className="LiveSpace-loading" />
              <p className="loading">Join the conversation...</p>
              <p className="loading-notify">
                Please 👉🏼{" "}
                <button onClick={handleClickToLogin} className="loading-login">
                  login/signup
                </button>{" "}
                to instantly access rooms. 🎉
              </p>
            </div>
          </div>
        );
  }

  if (!room || !liveKitToken) {
    // Handles cases where room data isn't loaded or token isn't fetched yet, even if logged in.
    // Or if a guest user still waiting for token.
    return (
        <div className="LiveSpace">
            <Nav />
            <div className="loading-container">
                <img src={logo} alt="MOCRS Logo" className="LiveSpace-loading" />
                <p className="loading">Preparing LiveKit room...</p>
                {!liveKitToken && <small className="loading-notify">Waiting for access token...</small>}
            </div>
        </div>
    );
  }

  return (
    <div className="LiveSpace">
      <Nav />
      <LiveKitRoom
        token={liveKitToken}
        serverUrl={LIVEKIT_SERVER_URL}
        roomName={room.name} // Pass the actual room name
        // Pass a callback for when user leaves, so LiveSpace can navigate
        onLeave={handleMeetingEnd}
      />
      {/* Comment out JitsiMeeting component
      <JitsiMeeting
        domain="join.mocrs.com"
        roomName={room.name}
        jwt={token}
        // ... other Jitsi props
      />
      */}
    </div>
  );
};

export default LiveSpace;
