import { useState, useEffect, useCallback, useRef, useContext } from "react";
import { JitsiMeeting } from "@jitsi/react-sdk";
import { useParams, useNavigate } from "react-router-dom";
import AuthContext from "./AuthContext";
import {
  getRoom,
  joinRoom,
  leaveRoom,
  createJitsiToken,
} from "../services/api";
import "./LiveSpace.css";
import Nav from "../components/Nav";
import ico from "../assets/mocrs.ico";
import logo from "../assets/mocrs.gif";

let interfaceConfig = {
  DEFAULT_LOGO_URL: logo,
  DEFAULT_WELCOME_PAGE_LOGO_URL: logo,
  JITSI_WATERMARK_LINK: "join.mocrs.com",
  DEFAULT_REMOTE_DISPLAY_NAME: "Fellow Mocrstar",
  SHOW_JITSI_WATERMARK: false,
  SHOW_WATERMARK_FOR_GUESTS: false,
  SHOW_BRAND_WATERMARK: false,
  BRAND_WATERMARK_LINK: "",
  SHOW_POWERED_BY: false,
  SHOW_PROMOTIONAL_CLOSE_PAGE: false,
  MOBILE_APP_PROMO: false,
  DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
  HIDE_INVITE_MORE_HEADER: true,
  FAVICON: {
    enabled: true,
    src: ico,
  },
};

const LiveSpace = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [room, setRoom] = useState(null);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const jitsiApiRef = useRef(null);

  useEffect(() => {
    const fetchRoomAndToken = async () => {
      try {
        const roomResponse = await getRoom(id);
        setRoom(roomResponse.data);
        if (!roomResponse.data) {
          setError("Room not found");
        }
        if (user !== null) {
          const data = { ...roomResponse.data, user: user };
          const tokenResponse = await createJitsiToken(data);
          setToken(tokenResponse.data.token);
          console.log("////////////// User established: //////////////////");
          console.log(tokenResponse.data.token);
        } else {
          // const data = { user: null };
          // const guestResponseToken = await createJitsiToken(data);
          // setToken(guestResponseToken.data.token);
          // console.log("////////////// User established: //////////////////");
          // console.log(guestResponseToken.data.token);
          setToken(null);
        }
      } catch (error) {
        console.error("Error fetching room or creating token:", error);
        setError(
          error.response?.data?.message || "An unexpected error occurred"
        );
      } finally {
        setIsLoading(false); // Update loading state
      }
    };

    fetchRoomAndToken();

    return () => {
      if (jitsiApiRef.current) {
        jitsiApiRef.current.dispose();
      }
    };
  }, [id, user]);

  const handleMeetingEnd = useCallback(() => {
    navigate("/spaces");
  }, [navigate]);

  const handleClick = () => {
    navigate("/login");
  };

  const handleAPIReady = useCallback(
    (apiObj) => {
      jitsiApiRef.current = apiObj;

      const eventHandlers = {
        participantJoined: () => joinRoom(id).catch(console.error),
        participantLeft: () => leaveRoom(id).catch(console.error),
        videoConferenceLeft: () => {
          console.log("User left the meeting!");
          handleMeetingEnd();
        },
      };

      // Add event listeners
      Object.entries(eventHandlers).forEach(([event, handler]) => {
        apiObj.addEventListener(event, handler);
      });

      // Return cleanup function
      return () => {
        Object.entries(eventHandlers).forEach(([event, handler]) => {
          apiObj.removeEventListener(event, handler);
        });
      };
    },
    [id, handleMeetingEnd]
  );

  if (error) {
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
    return (
      <div className="LiveSpace">
        <Nav />
        <div className="loading-container">
          <img src={logo} alt="MOCRS Logo" className="LiveSpace-loading" />
          <p className="loading">Loading space...</p>
          <small className="loading-notify">
            You might want to{" "}
            <button onClick={handleClick} className="loading-login">
              login/signup
            </button>{" "}
            to instantly access rooms.
          </small>
        </div>
      </div>
    );
  }

  if (!room || !token) {
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
    <div className="LiveSpace">
      <Nav />
      <JitsiMeeting
        domain="join.mocrs.com"
        roomName={room.name}
        jwt={token}
        configOverwrite={{
          reactions: {
            enabled: true,
          },
          prejoinPageEnabled: true,
          disableDeepLinking: true,
        }}
        interfaceConfigOverwrite={interfaceConfig}
        userInfo={{
          displayName: user?.firstName || "",
          email: user?.email || "",
        }}
        onApiReady={handleAPIReady}
        onReadyToClose={handleMeetingEnd}
        getIFrameRef={(node) => {
          if (node) {
            node.style.height = "93vh";
          }
        }}
      />
    </div>
  );
};

export default LiveSpace;
