const Chat = require('../models/Chat');

const saveMessage = async (userId, requestId, messageText, sender) => {
  if (!userId || !requestId) {
    console.error("Error: Missing userId or requestId in saveMessage function.");
    throw new Error("Missing userId or requestId.");
  }
  try {
    const chat = await Chat.findOne({ userId: userId, requestId: requestId });
    if (chat) {
      chat.messages.push({ messageText, sender });
      await chat.save();
      console.log(`Message saved to existing chat for requestId: ${requestId}`);
    } else {
      const newChat = new Chat({
        userId,
        requestId,
        messages: [{ messageText, sender }]
      });
      await newChat.save();
      console.log(`New chat created and message saved for requestId: ${requestId}`);
    }
  } catch (error) {
    console.error("Error saving message to database: ", error.message, error.stack);
    throw error;
  }
};

const fetchMessages = async (requestId, userId) => {
  if (!requestId || !userId) {
    console.error("Error: Missing requestId or userId in fetchMessages function.");
    throw new Error("Missing requestId or userId.");
  }
  try {
    const chat = await Chat.findOne({ userId: userId, requestId: requestId });
    if (chat) {
      console.log(`Messages fetched for chat with requestId: ${requestId}`);
      return chat.messages;
    } else {
      console.log(`No chat found for requestId: ${requestId}. Returning empty array.`);
      return [];
    }
  } catch (error) {
    console.error("Error fetching messages from database: ", error.message, error.stack);
    throw error;
  }
};

module.exports = { saveMessage, fetchMessages };