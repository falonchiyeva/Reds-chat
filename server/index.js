const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
app.get('/', (req, res) => res.send('Signaling server is running'));

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

/**
 * Simple signaling:
 * - Client joins a room (roomId)
 * - Clients exchange 'offer', 'answer' and 'ice-candidate' events
 * Note: This is minimal and for demo/education only.
 */

io.on('connection', socket => {
  console.log('Socket connected:', socket.id);

  socket.on('join-room', ({ roomId, userId }) => {
    socket.join(roomId);
    console.log(`${userId} joined ${roomId}`);
    // notify others
    socket.to(roomId).emit('user-joined', { userId, socketId: socket.id });

    socket.on('offer', payload => {
      // payload: { toSocketId, sdp, fromUserId }
      io.to(payload.toSocketId).emit('offer', { sdp: payload.sdp, fromSocketId: socket.id, fromUserId: payload.fromUserId });
    });

    socket.on('answer', payload => {
      io.to(payload.toSocketId).emit('answer', { sdp: payload.sdp, fromSocketId: socket.id, fromUserId: payload.fromUserId });
    });

    socket.on('ice-candidate', payload => {
      io.to(payload.toSocketId).emit('ice-candidate', { candidate: payload.candidate, fromSocketId: socket.id });
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected', socket.id);
      socket.to(roomId).emit('user-left', { socketId: socket.id });
    });
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log('Signaling server listening on', PORT));
