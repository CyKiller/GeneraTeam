const chatRoomManager = {
  joinRoom: (socket, roomId) => {
    try {
      socket.join(roomId);
      console.log(`A user joined room: ${roomId}`);
    } catch (err) {
      console.error('Error joining room:', err.message, err.stack);
    }
  },

  leaveRoom: (socket, roomId) => {
    try {
      socket.leave(roomId);
      console.log(`A user left room: ${roomId}`);
    } catch (err) {
      console.error('Error leaving room:', err.message, err.stack);
    }
  },

  sendMessage: (io, roomId, data) => {
    try {
      io.to(roomId).emit('new message', data);
      console.log(`Message sent to room ${roomId}: ${data.text}`);
    } catch (err) {
      console.error('Error sending message:', err.message, err.stack);
    }
  }
};

module.exports = chatRoomManager;