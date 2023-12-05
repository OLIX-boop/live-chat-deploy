import './style.css';
import MessagesReceived from './messages';
import SendMessage from './send-message';
import RoomAndUsersColumn from './room-and-users';

var connected = false;
const Chat = ({ username, room, socket }) => {
  
    if (!socket.connected && !connected) {
      connected = true;
      const user = localStorage.getItem('user');
      const userRoom = localStorage.getItem('room');
      if (userRoom && userRoom !== "" && user && user !== "") {
        socket.emit('join_room', {username: user, room: userRoom});
      }
    }

  return (
    <div className='chatContainer'>
        <RoomAndUsersColumn socket={socket} username={username} room={room} />
      <div>
        <MessagesReceived socket={socket} usersname={username}  />
        <SendMessage socket={socket} username={username} room={room} />
      </div>
    </div>
  );
};

export default Chat;