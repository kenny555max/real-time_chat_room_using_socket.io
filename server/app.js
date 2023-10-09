import express from 'express';
import cors from 'cors';
import { createServer } from 'node:http';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);

app.use(cors());

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000'
    }
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

let users = [];

const adduser = (user) => {
    const check = users.filter(use => use.name === user.name);

    if (check.length > 0) return;

    users = [...users, user];
}

const getuser = (socketId) => {
    return users.filter((user) => user.id === socketId);
}

io.on('connection', (socket) => {
    socket.on('connected', ({ name, room }) => {
        adduser({ name, room, id: socket.id });

        socket.emit('message', { user: 'admin', text: `${name}, welcome to the room ${room}` });
        socket.broadcast.to(room).emit('message', { user: 'admin', text: `${name} has joined the room` });
        
        socket.join(room);
    });

    socket.once('messaging', ({ name, room }) => {
        socket.broadcast.to(room).emit('message', { user: 'admin', text: `${name} is typing` });
    });

    socket.on('sendMessage', ({ name, room, message }) => {
        io.to(room).emit('message', { user: name, text: message });
    });

    socket.on('disconnect', () => {
        console.log('user left');

        const user = getuser(socket.id);

        if (user.length === 0) return;

        console.log(user);

        //io.to(user.room).emit('message', { user: 'admin', text: `${user[0].name} has left the room` });
    })
});

const PORT = 5000;

server.listen(PORT, () => console.log(`Server listening on PORT ${PORT}`));