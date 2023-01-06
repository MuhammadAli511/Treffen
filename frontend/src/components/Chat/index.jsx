import { useState, useEffect, useRef } from "react";
import { MdSend } from "react-icons/md";

import styles from "./index.module.css";

const Chat = ({ chats, setChats, rtmChannel, rtmClient }) => {
  const chatsRef = useRef(null);
  const [msg, setMsg] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!msg || !rtmChannel) return;

    const message = rtmClient.createMessage({ text: msg, messageType: "TEXT" });
    await rtmChannel.sendMessage(message);
    setChats((prevChats) => [...prevChats, { member: "you", message: msg }]);
    setMsg("");
  };

  const scrollToBottom = () => {
    if (!chatsRef.current) return;
    const scrollHeight = chatsRef.current.scrollHeight;
    const height = chatsRef.current.clientHeight;
    const maxScrollTop = scrollHeight - height;
    chatsRef.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
  };

  useEffect(() => {
    scrollToBottom();
  }, [chats]);

  return (
    <div className={styles.container}>
      {chats.length > 0 ? (
        <div className={styles.chats} ref={chatsRef}>
          {chats.map((chat, i) => (
            <div
              key={i}
              className={`${styles.chat} ${
                chat.member === "you" ? styles.own_chat : ""
              }`}
            >
              <p className={styles.chat_message}>{chat.message}</p>
              <p className={styles.chat_author}>{chat.member}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.no_chat}>
          <p>No Messages!</p>
        </div>
      )}
      <form className={styles.message_box} onSubmit={sendMessage}>
        <input
          type="text"
          className={styles.message_input}
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
        />
        <button type="submit" className={styles.send_button}>
          <MdSend />
        </button>
      </form>
    </div>
  );
};

export default Chat;
