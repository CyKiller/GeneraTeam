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
const http = require('http');
const { Server } = require("socket.io");
const Chat = require('./models/Chat'); // Added Chat model for saving chat messages

if (!process.env.DATABASE_URL || !process.env.SESSION_SECRET || !process.env.OPENAI_API_KEY) {
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

  socket.on('send message', (data) => {
    console.log(`Message received: ${data.text} in room: ${data.roomId}`);
    // Emit message only to the specific room (roomId)
    io.to(data.roomId).emit('new message', data);
  });

  // Joining a room based on requestId
  socket.on('join room', (roomId) => {
    socket.join(roomId);
    console.log(`A user joined room: ${roomId}`);
  });

  socket.on('leave room', (roomId) => {
    socket.leave(roomId);
    console.log(`A user left room: ${roomId}`);
  });
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

module.exports = app;