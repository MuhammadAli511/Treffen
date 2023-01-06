import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  BsFillMicFill,
  BsFillMicMuteFill,
  BsFillCameraVideoFill,
  BsFillCameraVideoOffFill,
} from "react-icons/bs";
import { FaUsers } from "react-icons/fa";
import {
  MdCallEnd,
  MdEditNote,
  MdMessage,
  MdScreenShare,
  MdStopScreenShare,
} from "react-icons/md";

import { useClient } from "../../config";
import styles from "./index.module.css";

const VideoCallControls = ({
  tracks,
  setStartCall,
  shareScreen,
  setShareScreen,
  setInCall,
  closeScreenShare,
  isPanelOpen,
  setIsPanelOpen,
  panelMode,
  setPanelMode,
  rtmClient,
  trackState,
  setTrackState,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const client = useClient();
  // const [trackState, setTrackState] = useState({
  //   video: tracks[1]?.enabled,
  //   audio: tracks[0]?.enabled,
  // });

  const mute = (type) => async () => {
    if (type === "audio") await tracks[0].setEnabled(!trackState[type]);
    if (type === "video") await tracks[1].setEnabled(!trackState[type]);
    setTrackState({
      ...trackState,
      [type]: !trackState[type],
    });
  };

  
  const leaveChannel = async () => {
    await rtmClient.logout();
    await client.leave();
    client.removeAllListeners();
    tracks[0].close();
    tracks[1].close();
    closeScreenShare();
    setStartCall(false);
    setInCall(false);
    navigate("/treffen", { state: { from: location.pathname } });
  };

  const toggleScreenShare = () => setShareScreen(!shareScreen);

  const toggleMode = (mode) => () => {
    if (mode === panelMode) {
      setIsPanelOpen(false);
      setPanelMode("");
    } else {
      setPanelMode(mode);
      setIsPanelOpen(true);
    }
  };

  return (
    <div
      className={styles.video_controllers}
      style={{ width: isPanelOpen ? "75%" : "100%" }}
    >
      <button className={trackState.audio ? "on" : ""} onClick={mute("audio")}>
        {trackState.audio ? <BsFillMicFill /> : <BsFillMicMuteFill />}
      </button>
      <button className={trackState.video ? "on" : ""} onClick={mute("video")}>
        {trackState.video ? (
          <BsFillCameraVideoFill />
        ) : (
          <BsFillCameraVideoOffFill />
        )}
      </button>
      <button onClick={toggleScreenShare}>
        {shareScreen ? <MdStopScreenShare /> : <MdScreenShare />}
      </button>
      <button className={styles.end_call} onClick={() => leaveChannel()}>
        <MdCallEnd />
      </button>
      <button onClick={toggleMode("people")}>
        <FaUsers />
      </button>
      <button onClick={toggleMode("chat")}>
        <MdMessage />
      </button>
    </div>
  );
};

export default VideoCallControls;
