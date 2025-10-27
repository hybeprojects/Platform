const db = require('./db');

module.exports = function(io) {
  io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('join conversation', (conversationId) => {
      socket.join(conversationId);
    });

    socket.on('chat message', async (msg) => {
      try {
        const newMessage = await db.query(
          'INSERT INTO messages (conversation_id, sender_id, content) VALUES ($1, $2, $3) RETURNING *',
          [msg.conversationId, msg.senderId, msg.content]
        );
        io.to(msg.conversationId).emit('chat message', newMessage.rows[0]);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });
};
