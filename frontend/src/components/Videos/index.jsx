import { AgoraVideoPlayer } from "agora-rtc-react";
import { createAvatar } from "@dicebear/avatars";
import * as style from "@dicebear/avatars-bottts-sprites";
import Svg from "react-inlinesvg";

import styles from "./index.module.css";

const Videos = ({
  users,
  allUsers,
  tracks,
  screenTracks,
  trackState,
  myUid,
}) => {
  return (
    <div className={styles.videos}>
      {trackState.video ? (
        <AgoraVideoPlayer className={styles.video} videoTrack={tracks[1]} />
      ) : (
        <div className={styles.video}>
          <span className={styles.icon}>
            <Svg
              src={createAvatar(style, {
                seed: myUid.split("-")[0],
                dataUri: true,
              })}
              alt="avatar"
            />
            <div className={styles.username}>You</div>
          </span>
        </div>
      )}

      {screenTracks ? (
        Array.isArray(screenTracks) ? (
          <AgoraVideoPlayer
            className={styles.video}
            videoTrack={screenTracks[0]}
          />
        ) : (
          <AgoraVideoPlayer
            className={styles.video}
            videoTrack={screenTracks}
          />
        )
      ) : (
        ""
      )}

      {users.length > 0 &&
        users.map((user) => {
          if (user.videoTrack)
            return (
              <AgoraVideoPlayer
                className={styles.video}
                key={user.uid}
                videoTrack={user.videoTrack}
              />
            );
        })}

      {allUsers.length > 0 &&
        allUsers.map((User) => {
          if (!users.map((vus) => vus.uid).includes(User))
            return (
              <div className={styles.video} key={User}>
                <span className={styles.icon}>
                  <Svg
                    src={createAvatar(style, {
                      seed: User.split("-")[0],
                      dataUri: true,
                    })}
                    alt="avatar"
                  />
                  <div className={styles.username}>{User.split("-")[0]}</div>
                </span>
              </div>
            );
        })}
    </div>
  );
};

export default Videos;
