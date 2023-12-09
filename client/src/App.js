import './App.css';
import { useState } from 'react';
import Home from './pages/home';
import Chat from './pages/chat';
import Login from './pages/auth/login';
import Register from './pages/auth/register';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import io from 'socket.io-client';


var SOCKET;
if (process.env.REACT_APP_STATUS) {// il file env è escluso da github. Quindi durante il deploy andrà in modalità deploy;
  SOCKET = 'http://localhost:4000';
  console.log("Current mode: BUILD");
} else {
  SOCKET = 'https://live-chat-wuyj.onrender.com';
  console.log("Current mode: DEPLOY");
}
console.log("Socket: " + SOCKET);

const socket = io.connect(SOCKET);
socket.on("connect", () => {
  console.log(socket.connected ? "Socket connesso con successo" : "Impossibile connettersi al socket"); // controlla se si connette al socket
});

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
                room={room}
                socket={socket}
              />
            }
          />
          <Route
            path='/chat'
            element={
              <Chat                 
                username={username}
                setUsername={setUsername}
                room={room}
                setRoom={setRoom}
                socket={socket} 
              />
            }
          />
          <Route
            path='/login'
            element={
              <Login
                socket={socket}
                setUsername={setUsername}
                setRoom={setRoom}
              />
            }
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