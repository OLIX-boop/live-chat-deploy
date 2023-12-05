import './style.css'
import { useState, useEffect, useRef } from 'react';

const Messages = ({ socket, usersname }) => {
  const [messagesRecieved, setMessagesReceived] = useState([]);
  const [inEditMode, setInEditMode] = useState({active: false, id: 99999, uniqueId: ''});
  const [editMessageContent, setEditMessageContent] = useState("");
  const messagesColumnRef = useRef(null);

  useEffect(() => {
    socket.on('receive_message', (data) => {
      setMessagesReceived((state) => [
        ...state,
        {
          message: data.message,
          username: data.username,
          __createdtime__: data.__createdtime__,
          isWelcome : data.isWelcome || false
        },
      ]);
    });

    return () => socket.off('receive_message');
  }, [socket]);

  useEffect(() => {
    socket.on('last_100_messages', (last100Messages) => {
      last100Messages = JSON.parse(last100Messages);
      last100Messages = sortMessagesByDate(last100Messages);
      setMessagesReceived((state) => [...last100Messages, ...state]);
    });

    return () => socket.off('last_100_messages');
  }, [socket]);

  useEffect(() => {
    messagesColumnRef.current.scrollTop = messagesColumnRef.current.scrollHeight;
  }, [messagesRecieved]);



  function sortMessagesByDate(messages) {
    return messages.sort(
      (a, b) => parseInt(a.__createdtime__) - parseInt(b.__createdtime__)
    );
  }

  function formatDateFromTimestamp(timestamp) {
    return new Date(timestamp).toLocaleString()
  };

  function editMessage(id, message, uniqueId) {
    if (!inEditMode.active) {
      setInEditMode({active: true, id: id, uniqueId: uniqueId});
      setEditMessageContent(message);
    }
  }

  function handleEditMode(e) {
    if (e.code === "Escape") {
      setInEditMode({active: false, id: 99999, uniqueId: ""})
      setEditMessageContent("");
    } else if (e.code === "Enter") {
      messagesRecieved[inEditMode.id].message = editMessageContent;
      socket.emit('edit_message', { id: inEditMode.uniqueId, message: editMessageContent});
      setEditMessageContent("");
      setInEditMode({active: false, id: 99999, uniqueId: ""});
    }
  }

  if (usersname === "") usersname = localStorage.getItem('user'); // reset usersname variable if user refreshes the page
  
  return (
    <div className='messagesColumn' ref={messagesColumnRef}>
      {messagesRecieved.map((msg, i) => (
        <div className='message' key={i}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className='msgMeta'>{msg.username}</span>
            <span className='msgMeta'>
              {formatDateFromTimestamp(msg.__createdtime__)}
            </span>
          </div>
          {
           !msg.isWelcome && msg.username === usersname &&
            <div className='edit' onClick={() => editMessage(i, msg.message, msg.id)}>
              <span>Edit</span>
            </div>
          }
          {!(inEditMode.id === i && inEditMode.active) ?
          <p className='msgText'>{msg.message}</p>
          :
          <input type="text" name="editMSG" onChange={(e) => setEditMessageContent(e.target.value)} defaultValue={msg.message} onKeyUp={handleEditMode}/>
          }

          <br />
        </div>
      ))}
    </div>
  );
};

export default Messages;