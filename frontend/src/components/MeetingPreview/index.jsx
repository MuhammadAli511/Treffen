import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AgoraVideoPlayer } from "agora-rtc-react";
import AgoraRTC from "agora-rtc-sdk-ng";
import Select from "react-select";
import {
  BsFillMicFill,
  BsFillMicMuteFill,
  BsFillCameraVideoFill,
  BsFillCameraVideoOffFill,
} from "react-icons/bs";

import styles from "./index.module.css";

const MeetingPreview = ({ ready, tracks, token, setStartCall }) => {
  const navigate = useNavigate();
  const [audioDevices, setAudioDevices] = useState([]);
  const [videoDevices, setVideoDevices] = useState([]);
  const [trackState, setTrackState] = useState({ audio: true, video: true });

  useEffect(() => {
    AgoraRTC.getDevices().then((devices) => {
      const audioDevices = devices.filter(
        (device) => device.kind === "audioinput"
      );
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );
      setAudioDevices(audioDevices);
      setVideoDevices(videoDevices);
    });
  }, []);

  const mute = (type) => async () => {
    if (type === "audio") await tracks[0].setEnabled(!trackState.audio);
    if (type === "video") await tracks[1].setEnabled(!trackState.video);
    setTrackState({
      ...trackState,
      [type]: !trackState[type],
    });
  };

  const handleDeviceChange = (type) => async (option) => {
    if (type === "audio") await tracks[0].setDevice(option.value);
    if (type === "video") await tracks[1].setDevice(option.value);
  };

  const onCancel = () => {
    if (tracks) tracks.forEach((track) => track.close());
    navigate(-1);
  };

  return (
    <div className={styles.container}>
      <aside className={styles.side_panel}>
        <div className={styles.device_selector}>
          {audioDevices ? (
            <div className={styles.audo_devices}>
              <h3 style={{ color: "#fff" }}>Audio Devices</h3>
              <Select
                className={styles.device_list}
                options={audioDevices.map((dev) => ({
                  value: dev.deviceId,
                  label: dev.label,
                }))}
                onChange={handleDeviceChange("audio")}
              />
            </div>
          ) : (
            <h3 style={{ color: "#fff" }}>No Audio Device Found</h3>
          )}
          {videoDevices ? (
            <div className={styles.video_devices}>
              <h3 style={{ color: "#fff" }}>Video Devices</h3>
              <Select
                className={styles.device_list}
                options={videoDevices.map((dev) => ({
                  value: dev.deviceId,
                  label: dev.label,
                }))}
                onChange={handleDeviceChange("video")}
              />
            </div>
          ) : (
            <h3 style={{ color: "#fff" }}>No Video Device Found</h3>
          )}
        </div>
        <div>
          <button
            className={styles.button}
            onClick={() => setStartCall(true)}
            disabled={!ready}
          >
            Join Call
          </button>
        </div>
        <div>
          <button
            className={styles.button}
            onClick={onCancel}
            disabled={!tracks}
          >
            Cancel
          </button>
        </div>
      </aside>

      <div className={styles.preview_container}>
        <div className={styles.video_container}>
          {ready && tracks[1] && (
            <AgoraVideoPlayer videoTrack={tracks[1]} className={styles.video} />
          )}
          {ready && tracks && (
            <div className={styles.preview_controls}>
              <button className={styles.control_button} onClick={mute("video")}>
                {trackState.video ? (
                  <BsFillCameraVideoFill />
                ) : (
                  <BsFillCameraVideoOffFill />
                )}
              </button>
              <button className={styles.control_button} onClick={mute("audio")}>
                {trackState.audio ? <BsFillMicFill /> : <BsFillMicMuteFill />}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MeetingPreview;
