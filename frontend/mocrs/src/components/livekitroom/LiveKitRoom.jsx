import React from 'react';
import {
  LiveKitRoom as LiveKitRoomComponent,
  RoomAudioRenderer,
  ControlBar,
  GridLayout,
  ParticipantTile,
  useTracks,
  useParticipants, // Import useParticipants
} from '@livekit/components-react';
import { Track } from 'livekit-client';
import '@livekit/components-styles';
import './LiveKitRoom.css';

const LiveKitRoom = ({ token, serverUrl, roomName, onLeave }) => {
  const participants = useParticipants(); // Get participants

  if (!token || !serverUrl) {
    // ... (existing error handling)
    return (
      <div className="livekit-room-container">
        <p>Missing token or server URL for LiveKit.</p>
      </div>
    );
  }

  return (
    <LiveKitRoomComponent
      // ... (existing props: token, serverUrl, roomName, connect, audio, video, onDisconnected, onError)
      token={token}
      serverUrl={serverUrl}
      roomName={roomName}
      connect={true}
      audio={true}
      video={true}
      onDisconnected={() => {
        if (onLeave) onLeave();
      }}
    >
      <div className="livekit-video-conference">
        {/* Main video grid and controls */}
        <div className="livekit-main-stage"> {/* Added a wrapper for grid and controls */}
          <GridLayout tracks={useTracks([Track.Source.Camera, Track.Source.ScreenShare])}>
            <ParticipantTile />
          </GridLayout>
          <RoomAudioRenderer />
          <ControlBar controls={{ microphone: true, camera: true, screenShare: true, chat: true, leave: true }} />
        </div>

        {/* Participant List Sidebar/Section */}
        <div className="livekit-participant-list">
          <h4>Participants ({participants.length})</h4>
          <ul>
            {participants.map(p => (
              <li key={p.identity}>
                {p.name || p.identity}
                {p.isLocal && " (You)"}
                {/* You can add more info, e.g., p.isSpeaking, icons for mic/cam status */}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </LiveKitRoomComponent>
  );
};

export default LiveKitRoom;
