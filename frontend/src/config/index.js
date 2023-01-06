import {
  createClient,
  createMicrophoneAndCameraTracks,
  createScreenVideoTrack
} from "agora-rtc-react";

const clientConfig = {
  mode: "rtc",
  codec: "vp8",
};

const screenTrackConfig = {
  encoderConfig: "720p_3",
  optimizationMode: "detail",
};

export const appId = "5f6b6ab3b6cc4362b19410cae478961c";
export const appCertificate = "859ee2f1f4b041fe83f84a5fb162e317";

export const useClient = createClient(clientConfig);
export const useScreenClient = createClient(clientConfig);
export const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();
export const useScreenTracks = createScreenVideoTrack(
  screenTrackConfig,
  "auto"
);

export const rtmLogin = async ({
  client,
  channel,
  uid,
  token,
  setAllUsers,
}) => {
  await client.login({ uid, token }).then(async () => {
    console.log("Login Successful");
    await channel.join();
    const members = await channel.getMembers();
    setAllUsers([...members.filter((memberId) => memberId !== uid)]);
  });
};
