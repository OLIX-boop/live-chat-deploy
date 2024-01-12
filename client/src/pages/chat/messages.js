import "./style.css";
import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faXmark } from "@fortawesome/free-solid-svg-icons";

const Messages = ({ socket, usersname, room }) => {
  const [messagesRecieved, setMessagesReceived] = useState([]);
  const [preventScroll, setPreventScroll] = useState(false);
  const [inEditMode, setInEditMode] = useState({
    active: false,
    id: 99999,
    uniqueId: "",
  });
  const [editMessageContent, setEditMessageContent] = useState("");
  const messagesColumnRef = useRef(null);
  const messageContentEdit = useRef(null);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      console.log(data) 
      setMessagesReceived((state) => [
        ...state,
        {
          message: data.message,
          username: data.username,
          __createdtime__: data.__createdtime__,
          isWelcome: data.isWelcome || false,
          id: data.id || null
        },
      ]);
    });

    return () => socket.off("receive_message");
  }, [socket]);

  socket.on("edit_message", (data) => {
    setPreventScroll(true);
    console.log(data)
    const newState = messagesRecieved.map((obj) => {
      if (obj.id === data.id) {
        return {
          ...obj,
          message: data.message,
          __createdtime__: data.createdtime,
          edited: true,
        };
      }

      return obj;
    });

    
    setMessagesReceived(newState);
    setEditMessageContent("");
    setInEditMode({ active: false, id: 99999, uniqueId: "" });
  });

  useEffect(() => {
    socket.on("last_100_messages", (last100Messages) => { 
      last100Messages = sortMessagesByDate(last100Messages);
      setMessagesReceived((state) => [...last100Messages, ...state]);
    }); 

    return () => socket.off("last_100_messages");
  }, [socket]);

  useEffect(() => {
    if (!preventScroll) {
      setPreventScroll(false);
      messagesColumnRef.current.scrollTop = messagesColumnRef.current.scrollHeight;
    }
  }, [messagesRecieved, preventScroll]);

  function sortMessagesByDate(messages) {
    return messages.sort(
      (a, b) => parseInt(a.__createdtime__) - parseInt(b.__createdtime__)
    );
  }

  function formatDateFromTimestamp(timestamp) {
    return new Date(timestamp).toLocaleString();
  }

  const editMessage = (id, message, uniqueId) => {
    console.log(id, message, uniqueId)
    console.log(!inEditMode.active)
    if (!inEditMode.active) {
      setInEditMode({ active: true, id: id, uniqueId: uniqueId });
      setEditMessageContent(message);
      setTimeout(() => {
        messageContentEdit.current.focus();  
        handleJump();
      }, 100);  
    }
  }

  const handleJump = () => {
    const range = document.createRange();
    const selection = window.getSelection();
    range.setStart(messageContentEdit.current, 1);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
  };

  function handleEditMode(e) {
    console.log(e.target);
    if (e.code === "Escape") {
      setInEditMode({ active: false, id: 99999, uniqueId: "" });
      setEditMessageContent("");
    } else if (e.code === "Enter") {
      socket.emit("edit_message", {
        id: inEditMode.uniqueId,
        message: editMessageContent,
        room: room,
      });
    }
  }
  
  if (usersname === "") usersname = localStorage.getItem("user"); // reset usersname variable if user refreshes the page

  return (
    <div className="messagesColumn" ref={messagesColumnRef}>
      {messagesRecieved.map((msg, i) => (
        <div
          className={msg.username === usersname ? "message owner" : "message"}
          key={i}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span className="msgMeta">
              {msg.username === usersname ? "Me" : msg.username}{" "}
              {msg.edited ? "(modified)" : ""}
            </span>
            <span className="msgMeta">
              {formatDateFromTimestamp(msg.__createdtime__)}
            </span>
          </div>

          <p
            className="msgText"
            suppressContentEditableWarning={true}
            onKeyUp={handleEditMode}
            onInput={(e) => setEditMessageContent(e.currentTarget.textContent)}
            ref={inEditMode.id === i && inEditMode.active ? messageContentEdit : null}
            contentEditable={inEditMode.id === i && inEditMode.active}
          >
            {msg.message}
          </p>

          {!msg.isWelcome && msg.username === usersname && (
            <div
              className="edit"
              onClick={() => editMessage(i, msg.message, msg.id)}
            >
              <span>
                {" "}
                {!(inEditMode.id === i && inEditMode.active) ? (
                  <FontAwesomeIcon icon={faPen} />
                ) : (
                  <FontAwesomeIcon style={{ fontSize: "3vh" }} icon={faXmark} />
                )}{" "}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Messages;
