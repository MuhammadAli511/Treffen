import AgoraRTC from "agora-rtc-sdk-ng";
import AgoraRTM from "agora-rtm-sdk";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import { appId, rtmLogin, useClient, useScreenClient } from "../../config";
import { getRtmToken } from "../../helper";

import Chat from "../Chat";
import PartipantsList from "../ParticpantsList";
import VideoCallControls from "../VideoCallControls";
import Videos from "../Videos";
import styles from "./index.module.css";

const screenUid = uuidv4();

const VideoCall = ({ ready, tracks, token, setInCall }) => {
  const { cid: channelName } = useParams();
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [startCall, setStartCall] = useState(false);
  const [shareScreen, setShareScreen] = useState(false);
  const [screenTracks, setScreenTracks] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [panelMode, setPanelMode] = useState("");
  const [rtmClient, setRtmClient] = useState(null);
  const [rtmChannel, setRtmChannel] = useState(null);
  const [chats, setChats] = useState([]);
  const [myUid, setMyUid] = useState("");
  const [blocks, setBlocks] = useState([
    {
      id: uuidv4(),
      html: "",
      tag: "h1",
    },
  ]);
  const [trackState, setTrackState] = useState({
    video: tracks[1]?.enabled,
    audio: tracks[0]?.enabled,
  });

  const screenClient = useScreenClient();
  const client = useClient();

  useEffect(() => {
    const myUID = "user-" + Math.floor(Math.random() * 1000000000);
    setMyUid(myUID);

    const init = async (channelName) => {
      client.on("user-published", async (user, mediaType) => {
        if (user.uid === screenUid) return;
        console.log("NEW USER: ", user, mediaType);
        await client.subscribe(user, mediaType);
        console.log("subscribe success");
        if (mediaType === "video")
          setUsers((prevUsers) => [...prevUsers, user]);

        if (mediaType === "audio") user.audioTrack?.play();
      });

      client.on("user-unpublished", (user, type) => {
        console.log("unpublished", user, type);
        if (type === "audio") user.audioTrack?.stop();

        if (type === "video")
          setUsers((prevUsers) =>
            prevUsers.filter((User) => User.uid !== user.uid)
          );
      });

      client.on("user-left", (user) => {
        console.log("leaving", user);
        setUsers((prevUsers) =>
          prevUsers.filter((User) => User.uid !== user.uid)
        );
      });

      const uid = await client.join(appId, channelName, token, myUID);
      console.log("My user id: ", uid);
      if (tracks) {
        let tracksToPublish = [];
        if (tracks[0].enabled) tracksToPublish.push(tracks[0]);
        if (tracks[1].enabled){
          tracksToPublish.push(tracks[1]);
          const videoTrack = tracks[1];
          console.log(videoTrack);
          const frame = videoTrack.getCurrentFrameData();
          console.log(frame);

          
        };
        if (tracksToPublish.length === 0) {
          toast.error(
            "Can not join with both audio & video disabled! Please Leave & Rejoin"
          );
          return;
        }
        await client.publish(tracksToPublish);
        setStartCall(true);
      }
    };

    const configRTM = async (channelName) => {
      const { data } = await getRtmToken(myUID);
      const token = data?.token;
      const uid = data?.uid;

      const instance = AgoraRTM.createInstance(appId);
      setRtmClient(instance);
      instance.on("ConnectionStateChanged", (state, reason) =>
        console.log("State changed To: " + state + " Reason: " + reason)
      );

      const channel = instance.createChannel(channelName);
      setRtmChannel(channel);

      channel.on("ChannelMessage", (message, memberId) =>
        setChats((prevChats) => {
          return [
            ...prevChats,
            { member: memberId.split("-")[0], message: message.text },
          ];
        })
      );
      channel.on("MemberJoined", (memberId) => {
        console.log(memberId, " joined the channel");
        console.log(allUsers, [...allUsers, memberId]);
        setAllUsers([...allUsers, memberId]);
      });
      channel.on("MemberLeft", (memberId) => {
        console.log(memberId, " left the channel");
        setAllUsers([...allUsers.filter((member) => member !== memberId)]);
      });

      rtmLogin({ uid, token, channel, client: instance, setAllUsers });
    };

    if (ready && tracks) {
      console.log("init ready with uid: ", myUID);
      init(channelName);
      configRTM(channelName);
    }
  }, [client, tracks, ready]);

  useEffect(() => {
    const init = async () => {
      try {
        const tracks = await AgoraRTC.createScreenVideoTrack(
          {
            encoderConfig: "720p_3",
            optimizationMode: "detail",
          },
          "auto"
        );

        if (Array.isArray(tracks))
          tracks[0].once("track-ended", handleShareScreenClose);
        else tracks.once("track-ended", handleShareScreenClose);
        await screenClient.join(appId, channelName, token, screenUid);
        await screenClient.publish(tracks);
        setScreenTracks(tracks);
      } catch (err) {
        setShareScreen(false);
      }
    };

    if (shareScreen && !screenTracks) init();
    else handleShareScreenClose();
  }, [shareScreen]);

  const handleShareScreenClose = async () => {
    await screenClient.leave();
    screenClient.removeAllListeners();
    if (Array.isArray(screenTracks)) {
      screenTracks.forEach((track) => track.close());
    } else screenTracks?.close();
    setShareScreen(false);
    setScreenTracks(null);
  };

  return (
    <div className={styles.container}>
      <Toaster />
      {ready && tracks && (
        <VideoCallControls
          setInCall={setInCall}
          setShareScreen={setShareScreen}
          setStartCall={setStartCall}
          shareScreen={shareScreen}
          tracks={tracks}
          closeScreenShare={handleShareScreenClose}
          isPanelOpen={isPanelOpen}
          setIsPanelOpen={setIsPanelOpen}
          panelMode={panelMode}
          setPanelMode={setPanelMode}
          rtmClient={rtmClient}
          trackState={trackState}
          setTrackState={setTrackState}
        />
      )}
      {startCall && tracks && (
        <Videos
          users={users}
          allUsers={allUsers}
          tracks={tracks}
          screenTracks={screenTracks}
          trackState={trackState}
          myUid={myUid}
        />
      )}
      {isPanelOpen ? (
        <aside className={styles.sidebar}>
          <div className={styles.tabs}>
            {["people", "chat", "note"].map((tab, i) => (
              <div
                key={i}
                className={`${styles.tab} ${
                  tab === panelMode ? styles.selected : ""
                }`}
                onClick={() => setPanelMode(tab)}
              >
                {tab}
              </div>
            ))}
          </div>
          {panelMode === "people" ? (
            <PartipantsList users={allUsers} channelName={channelName} />
          ) : null}
         
          {panelMode === "chat" ? (
            <Chat
              chats={chats}
              setChats={setChats}
              rtmChannel={rtmChannel}
              rtmClient={rtmClient}
            />
          ) : null}
        </aside>
      ) : null}
    </div>
  );
};

export default VideoCall;
