import './style.css';
import MessagesReceived from './messages';
import SendMessage from './send-message';
import RoomAndUsersColumn from './room-and-users';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

var connected = false;
const Chat = ({ username, room, socket, setUsername, setRoom }) => {
  const navigate = useNavigate();

    useEffect(() => {
      const user = localStorage.getItem('user');
      const userRoom = localStorage.getItem('room');

      if (!socket.connected && !connected) {
        connected = true;
        if (userRoom && userRoom !== "" && user && user !== "") {
          socket.emit('join_room', {username: user, room: userRoom});
          setUsername(user);
          setRoom(userRoom);
        }
      }

      if (username === '' && room === '' && user === null && userRoom === null) navigate('/login');
    })
    

  return (
    <div className='chatContainer'>
        <RoomAndUsersColumn socket={socket} username={username} room={room} setUsername={setUsername} setRoom={setRoom} />
      <div>
        <MessagesReceived socket={socket} usersname={username} room={room} />
        <SendMessage socket={socket} username={username} room={room} />
      </div>
    </div>
  );
};

export default Chat;