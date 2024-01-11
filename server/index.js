const express = require('express');
require('dotenv').config();
const http = require('http');
const cors = require('cors');
const app = express();
const { Server } = require('socket.io');

const harperSaveMessage = require('./services/save-messages');
const harperGetMessages = require('./services/get-messages');
const harperEditMessage = require('./services/edit-message');
const harperCreateUser = require('./services/create-user');
const harperSearchUser = require('./services/search-user');

const DB = require('./services/database');

const leaveRoom = require('./utils/leave-room');
const bcrypt = require('bcrypt');

app.use(cors()); // cors middleware
const server = http.createServer(app);

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

var port, corsOrigin;
if (process.env.STATUS) {// il file env è escluso da github. Quindi durante il deploy andrà in modalità deploy
  port = 4000;
  corsOrigin = "http://localhost:3000";

  console.log("Current mode: Build");
} else {
  port = 443;
  corsOrigin = "https://live-chat-client-j3o8.onrender.com";

  console.log("Current mode: Deploy");
}

console.log("Cors: "+corsOrigin);
console.log("Port: "+port);


const io = new Server(server, {
    cors: {
      origin: corsOrigin,
      methods: ['GET', 'POST'],
    },
});

let chatRoom = '';
let allUsers = [];

const CHAT_BOT = 'Chat';
io.on('connection', (socket) => {
  console.log(`User connected ${socket.id}`);

  socket.on('join_room', (data) => {
    const { username, room } = data; 
    socket.join(room);

    let __createdtime__ = Date.now(); 
    socket.to(room).emit('receive_message', { 
      message: `${username} has joined the chat room`,
      username: CHAT_BOT,
      __createdtime__,
    });

    socket.emit('receive_message', { //  socket.to(room) escludes current socked, so we trigger recieve_message manually
      message: `Welcome ${username}`,
      username: CHAT_BOT,
      __createdtime__,
      isWelcome: true
    });

    chatRoom = room;
    allUsers.push({ id: socket.id, username, room });
    chatRoomUsers = allUsers.filter((user) => user.room === room);
    socket.to(room).emit('chatroom_users', chatRoomUsers);
    socket.emit('chatroom_users', chatRoomUsers);

    harperGetMessages(room)
    .then((last100Messages) => {
      socket.emit('last_100_messages', last100Messages);
    })
    .catch((err) => console.log(err));
  });

  socket.on('send_message', (data) => {
    const { message, username, room, __createdtime__ } = data;
    io.in(room).emit('receive_message', data); // Send to all users in room, including sender
    console.log(data)
    harperSaveMessage(message, username, room, __createdtime__) // Save message in db
      .then((response) => console.log(response))
      .catch((err) => console.log(err));
  });

  socket.on('edit_message', (data) => {
    const { message, id, room } = data;
    console.log(data)
    harperEditMessage(message, id) // edit message in db
      .then((response) => 
        console.log(response)
      )
      .catch((err) => console.log(err));

      io.in(room).emit('edit_message', {...data, createdtime: Date.now()});
  });

  socket.on('leave_room', (data) => {
    const { username, room } = data;
    socket.leave(room);
    const __createdtime__ = Date.now();
    allUsers = leaveRoom(socket.id, allUsers);
    socket.to(room).emit('chatroom_users', allUsers);
    socket.to(room).emit('receive_message', {
      username: CHAT_BOT,
      message: `${username} has left the chat`,
      __createdtime__,
    });
    console.log(`${username} has left the chat`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected from the chat');
    const user = allUsers.find((user) => user.id == socket.id);
    if (user?.username) {
      allUsers = leaveRoom(socket.id, allUsers);
      socket.to(chatRoom).emit('chatroom_users', allUsers);
      socket.to(chatRoom).emit('receive_message', {
        message: `${user.username} has disconnected from the chat.`,
      });
    }
  });


  socket.on('register', async (data, callback) => {
    const { email, password, user } = data;
    const hashedPass = await bcrypt.hash(password,10);
    harperCreateUser(email, hashedPass, user)
    .then(() => {
      callback({});
    })
    .catch((err) => {callback({error: err})});
  });

  socket.on('login', async (data, callback) => {
    const { email, password } = data;

    harperSearchUser(email)
    .then(async (cryptedPassword) => {
      if (cryptedPassword.length < 1) return callback({success: false, message: "There's no account with that email."}); 
      
      try {
        cryptedPassword = cryptedPassword[0];
        await bcrypt.compare(password, cryptedPassword.password).then(function(autenticated) {
          if (autenticated) {
            console.log("login successfull");
            callback({success: true, username: cryptedPassword.username})
          } else {
            callback({success: false, message: "Wrong password."})
          }
        });
      } catch (err) {
        console.log(err);
        callback({error: err});
      }
    })
    .catch((err) => callback({error: err}));
  });

});

server.listen(port, console.log("Server running"));
