import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = ({ username, setUsername, room, setRoom, socket }) => {
    const navigate = useNavigate();

        useEffect(() => {
            if (room !== '' && username !== '') {
                socket.emit('join_room', { username, room });
                navigate('/chat', { replace: true });
            } else  navigate('/login', { replace: true });
        });


    return (
        <div>
        </div>
    )
}

export default Home;