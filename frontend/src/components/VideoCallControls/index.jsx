import { useState } from "react";
import {
  BsFillCameraVideoFill,
  BsFillCameraVideoOffFill, BsFillMicFill,
  BsFillMicMuteFill
} from "react-icons/bs";
import { FaUsers } from "react-icons/fa";
import {
  MdCallEnd,
  MdEditNote,
  MdMessage,
  MdScreenShare,
  MdStopScreenShare
} from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";

import { useEffect } from "react";
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
  const [isFrames, setIsFrames] = useState(false);
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
    //await rtmClient.logout();
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
  const toggleFrames = () => {
    if (isFrames) {
      console.log("isFrames",isFrames)
      setIsFrames(false);
    }
    else{
      setIsFrames(true);
    }
  }

  // call toggleFrames continuously until the user clicks the button again
  useEffect(() => {
    console.log("useEffect")
    const interval = setInterval(() => {
      console.log("in Interval")
      console.log(isFrames)
      if (isFrames) {
        const imageData=tracks[1].getCurrentFrameData();
        const canvas = document.createElement("canvas");
            canvas.width = imageData.width;
            canvas.height = imageData.height;
            const ctx = canvas.getContext("2d");
            ctx.putImageData(imageData, 0, 0);
            const dataURL = canvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.download = "frame.png";
            link.setAttribute("href", dataURL);
            link.click();
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [isFrames]);


  return (
    <div
      className={styles.video_controllers}
      style={{ width: isPanelOpen ? "75%" : "100%" }}
    >
      <button className={trackState.audio ? "on" : ""} onClick={mute("audio")}>
        {trackState.audio ? <BsFillMicFill /> : <BsFillMicMuteFill />}
      </button>
     
      <button className={styles.end_call} onClick={() => leaveChannel()}>
        <MdCallEnd />
      </button>
      <button className={trackState.video ? "on" : ""} onClick={mute("video")}>
        {trackState.video ? (
          <BsFillCameraVideoFill />
        ) : (
          <BsFillCameraVideoOffFill />
        )}
      </button>
      {/* make a toggle button and call function when clicked  */}

      <button className={shareScreen ? "on" : ""} onClick={toggleFrames}>
        {shareScreen ? <MdStopScreenShare /> : <MdScreenShare />}
      </button>

    </div>
  );
};

export default VideoCallControls;
