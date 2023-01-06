import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import VideoCall from "../../../components/VideoCall";
import MeetingPreview from "../../../components/MeetingPreview";
import { useMicrophoneAndCameraTracks } from "../../../config";
import { getRtcToken } from "../../../helper";

const Meeting = () => {
  const { cid: channel } = useParams();
  const { ready, tracks } = useMicrophoneAndCameraTracks();

  const [token, setToken] = useState(null);
  const [inCall, setInCall] = useState(false);

  useEffect(() => {
    getRtcToken({ channelName: channel }).then((res) =>{
      setToken(res.token);
      console.log(res.token);
    }
     
    );
  }, []);

  return (
    <div>
    {inCall ? (
      <VideoCall
        ready={ready}
        setInCall={setInCall}
        token={token}
        tracks={tracks}
      />
    ) : (
      <MeetingPreview
        ready={ready}
        tracks={tracks}
        token={token}
        setStartCall={setInCall}
      />
    )}
  </div>
  );
};

export default Meeting;