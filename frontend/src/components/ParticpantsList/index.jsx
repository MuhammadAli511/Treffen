import { useState } from "react";
import { createAvatar } from "@dicebear/avatars";
import * as style from "@dicebear/avatars-bottts-sprites";
import { FaClipboardCheck, FaRegClipboard, FaShareAlt } from "react-icons/fa";
import Svg from "react-inlinesvg";

import styles from "./index.module.css";

const PartipantsList = ({ users, channelName }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const copyToClipboard = async () => {
    if (typeof window === "undefined") return;
    setLoading(true);
    window.navigator.clipboard.writeText(channelName);
    setSuccess(true);
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      {users.length > 0 ? (
        <div className={styles.users}>
          {users.map((userId) => (
            <div key={userId} className={styles.user}>
              <div className={styles.icon}>
                <Svg
                  src={createAvatar(style, {
                    seed: userId.split("-")[0],
                    dataUri: true,
                  })}
                  alt="avatar"
                />
              </div>
              <div className={styles.userName}>{userId.split("-")[0]}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.no_people}>
          <p>No Participants!</p>
        </div>
      )}
      <button
        className={styles.share_button}
        onClick={copyToClipboard}
        disabled={loading}
      >
        <FaShareAlt />
        <span>Share Video Id</span>
        {success ? <FaClipboardCheck /> : <FaRegClipboard />}
      </button>
    </div>
  );
};

export default PartipantsList;
