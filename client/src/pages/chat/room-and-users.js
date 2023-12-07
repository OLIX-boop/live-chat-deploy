import './style.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tilt } from 'react-tilt';

const defaultOptions = {
	reverse:        true,  // reverse the tilt direction
	max:            15,     // max tilt rotation (degrees)
	perspective:    2500,   // Transform perspective, the lower the more extreme the tilt gets.
	scale:          1,    // 2 = 200%, 1.5 = 150%, etc..
	speed:          1000,   // Speed of the enter/exit transition
	transition:     true,   // Set a transition on enter/exit.
	axis:           null,   // What axis should be disabled. Can be X or Y.
	reset:          false,    // If the tilt effect has to be reset on exit.
	easing:         "cubic-bezier(.03,.98,.52,.99)",    // Easing on enter/exit.
}


const RoomAndUsers = ({ socket, username, room, setUsername, setRoom}) => {
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
    setUsername("");
    setRoom("");
    navigate('/', { replace: true });
  };

  return (
    <div className={'roomAndUsersColumn'}>
      <h2 className={'roomTitle'}>{room}</h2>

    <Tilt options={defaultOptions} className="usrs-cont">
      {roomUsers.length > 0 && <h5 className={'usersTitle'}>Users:</h5>}
          <ul className='usersList'>
            {roomUsers.map((user) => (
              <li
                style={{
                  fontWeight: `${user.username === username ? 'bold' : 'normal'}`,
                }}
                key={user.id}
              >
                {user.username + (user.username === username ? ' (Me)' : '')}
              </li>
            ))}
          </ul>

        <button className='btn btn-leave-outl' onClick={leaveRoom}>
          Leave
        </button>
      </Tilt>
    </div>
  );
};

export default RoomAndUsers;