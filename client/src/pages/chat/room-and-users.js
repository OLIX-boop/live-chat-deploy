import './style.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RoomAndUsers = ({ socket, username, room }) => {
  const [roomUsers, setRoomUsers] = useState([]);

  const navigate = useNavigate();

  if (username !== "" && room !== "") {
    localStorage.setItem('user', username);
    localStorage.setItem('room', room);
  }

  useEffect(() => {
    socket.on('chatroom_users', (data) => {

      setRoomUsers(data);
    });

    return () => socket.off('chatroom_users');
  }, [socket]);

  const leaveRoom = () => {
    const __createdtime__ = Date.now();
    socket.emit('leave_room', { username, room, __createdtime__ });
    localStorage.clear();
    navigate('/', { replace: true });
  };

  return (
    <div className={'roomAndUsersColumn'}>
      <h2 className={'roomTitle'}>{room}</h2>

      <div>
        {roomUsers.length > 0 && <h5 className={'usersTitle'}>Users:</h5>}
        <ul className={'usersList'}>
          {roomUsers.map((user) => (
            <li
              style={{
                fontWeight: `${user.username === username ? 'bold' : 'normal'}`,
              }}
              key={user.id}
            >
              {user.username}
            </li>
          ))}
        </ul>
      </div>

      <button className='btn btn-outline' onClick={leaveRoom}>
        Leave
      </button>
    </div>
  );
};

export default RoomAndUsers;