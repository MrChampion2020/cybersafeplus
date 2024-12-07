import ChatMessage from './models/ChatMessage.js';

export const handleSocketConnection = (io) => {
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('join', ({ doctorId, userId }) => {
      if (!userId) {
        console.error('User ID not provided when joining the room');
        return;
      }
      socket.join(doctorId);
      socket.userId = userId; // Store userId in the socket for future use
    });

    socket.on('sendMessage', async ({ doctorId, message, userId }) => {
      if (!userId) {
        console.error('User ID not provided when sending a message');
        return;
      }

      try {
        const newMessage = new ChatMessage({
          doctorId,
          sender: userId,
          message,
        });
        await newMessage.save();

        io.to(doctorId).emit('message', { sender: userId, text: message });
      } catch (error) {
        console.error('Error saving message:', error);
        socket.emit('error', { message: 'Failed to save message' });
      }
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};

