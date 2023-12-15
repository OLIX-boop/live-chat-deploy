import "./style.css";
import React, { useState } from "react";

const SendMessage = ({ socket, username, room }) => {
  const [message, setMessage] = useState("");

  const sendMessage = (e) => {
    if (message !== "") {
      if (e.key === "Enter" || e.key === undefined) {
        const __createdtime__ = Date.now();
        if (username === "" || room === "") {
          username = localStorage.getItem("user");
          room = localStorage.getItem("room");
        }
        socket.emit("send_message", {
          username,
          room,
          message,
          __createdtime__,
        });
        setMessage("");
      }
    }
  };

  return (
    <div className="sendMessageContainer">
      <textarea
        className="messageInput"
        name="sendMSG"
        cols="1"
        rows="1"
        style={{resize:'none'}}
        placeholder="Message..."
        onChange={(e) => setMessage(e.target.value)}
        value={message}
      >
      </textarea>
        <button className="btn btn-primary" onClick={sendMessage}>
          Send Message
        </button>
    </div>
  );
};

export default SendMessage;
