// Load environment variables
require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const authRoutes = require("./routes/authRoutes");
const requestRoutes = require('./routes/requestRoutes'); // Added requestRoutes
const chatRoutes = require('./routes/chatRoutes'); // Added chatRoutes
const newRequestRoutes = require('./routes/newRequestRoutes'); // Added newRequestRoutes
const feedbackRoutes = require('./routes/feedbackRoutes'); // Added feedbackRoutes
const historyRoutes = require('./routes/historyRoutes'); // Added historyRoutes
const taskRoutes = require('./routes/taskRoutes'); // Added taskRoutes
const githubRoutes = require('./routes/githubRoutes'); // Added githubRoutes
const http = require('http');
const { Server } = require("socket.io");
const Chat = require('./models/Chat'); // Added Chat model for saving chat messages
const chatRoomManager = require('./utils/chatRoomManager'); // Import chatRoomManager
const { saveMessage, fetchMessages } = require('./utils/chatDbHelper'); // Import chatDbHelper functions

if (!process.env.DATABASE_URL || !process.env.SESSION_SECRET || !process.env.OPENAI_API_KEY || !process.env.GITHUB_API_TOKEN) {
  console.error("Error: config environment variables not set. Please create/edit .env configuration file.");
  process.exit(-1);
}

const app = express();
const port = process.env.PORT || 3004;
const server = http.createServer(app);
const io = new Server(server);

// Middleware to parse request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Setting the templating engine to EJS
app.set("view engine", "ejs");

// Serve static files
app.use(express.static("public"));

// Database connection
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.error(`Database connection error: ${err.message}`);
    console.error(err.stack);
    process.exit(1);
  });

// Session configuration with connect-mongo
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DATABASE_URL }),
  }),
);

app.on("error", (error) => {
  console.error(`Server error: ${error.message}`);
  console.error(error.stack);
});

// Logging session creation and destruction
app.use((req, res, next) => {
  const sess = req.session;
  // Make session available to all views
  res.locals.session = sess;
  if (!sess.views) {
    sess.views = 1;
    console.log("Session created at: ", new Date().toISOString());
  } else {
    sess.views++;
    console.log(
      `Session accessed again at: ${new Date().toISOString()}, Views: ${sess.views}, User ID: ${sess.userId || '(unauthenticated)'}`,
    );
  }
  next();
});

// Authentication Routes
app.use(authRoutes);

// Request Routes - Added for handling user requests
app.use(requestRoutes);

// Chat Routes - Added for handling chat interface
app.use(chatRoutes);

// New Request Routes - Added for handling new request form
app.use(newRequestRoutes);

// Feedback Routes - Added for handling feedback submission
app.use(feedbackRoutes);

// History Routes - Added for handling user history and chats
app.use(historyRoutes);

// Task Routes - Added for handling task tracking and progress
app.use(taskRoutes);

// GitHub Routes - Added for handling GitHub API interactions
app.use('/api/github', githubRoutes);

// Root path response
app.get("/", (req, res) => {
  res.render("index");
});

// If no routes handled the request, it's a 404
app.use((req, res, next) => {
  res.status(404).send("Page not found.");
});

// Error handling
app.use((err, req, res, next) => {
  console.error(`Unhandled application error: ${err.message}`);
  console.error(err.stack);
  res.status(500).send("There was an error serving your request.");
});

// Socket.IO for real-time chat
io.on('connection', (socket) => {
  console.log('A user connected to the chat');

  socket.on('disconnect', () => {
    console.log('User disconnected from the chat');
  });

  socket.on('send message', async (data) => {
    if (!data.userId || !data.roomId) {
      console.error('Error: Missing userId or roomId in send message event');
      socket.emit('error', 'Missing userId or roomId');
      return;
    }
    try {
      // Save message to DB
      await saveMessage(data.userId, data.roomId, data.messageText, data.sender);
      // Emit message to the room
      io.to(data.roomId).emit('message received', data);
      // Emit notification to all users except those in the target room
      socket.to(data.roomId).emit('new message notification', { roomId: data.roomId, message: "New message received!" });
      console.log(`Notification sent for new message in room ${data.roomId}`);
    } catch (error) {
      console.error('Error handling send message event:', error.message, error.stack);
      socket.emit('error', 'Failed to send message');
    }
  });

  socket.on('join room', async (roomId) => {
    if (!roomId) {
      console.error('Error: Missing roomId in join room event');
      socket.emit('error', 'Missing roomId');
      return;
    }
    try {
      socket.join(roomId);
      console.log(`A user joined room: ${roomId}`);
      // Fetch message history for the room
      const messages = await fetchMessages(roomId);
      // Emit message history to the joining socket
      socket.emit('message history', { roomId, messages });
    } catch (error) {
      console.error('Error handling join room event:', error.message, error.stack);
      socket.emit('error', 'Failed to join room');
    }
  });

  socket.on('leave room', (roomId) => {
    if (!roomId) {
      console.error('Error: Missing roomId in leave room event');
      return;
    }
    chatRoomManager.leaveRoom(socket, roomId);
    console.log(`A user left room: ${roomId}`);
  });

  socket.on('connect_error', (err) => {
    console.error('Connection error:', err.message, err.stack);
  });
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

module.exports = app;