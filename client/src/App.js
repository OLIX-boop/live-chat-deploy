import './App.css';
import { useState } from 'react';
import Home from './pages/home';
import Chat from './pages/chat';
import Login from './pages/auth/login';
import Register from './pages/auth/register';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io.connect('https://live-chat-wuyj.onrender.com:4000');

function App() {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');

  return (
    <Router>
      <div className='App'>
        <Routes>
          <Route
            path='/'
            element={
              <Home
                username={username}
                setUsername={setUsername}
                room={room}
                setRoom={setRoom}
                socket={socket}
              />
            }
          />
          <Route
            path='/chat'
            element={<Chat username={username} room={room} socket={socket} />}
          />
          <Route
            path='/login'
            element={<Login socket={socket}/>}
          />
          <Route
            path='/register'
            element={<Register socket={socket}/>}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;