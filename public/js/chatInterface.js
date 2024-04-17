var socket = io();

// Form submission with new message in input box
var form = document.getElementById('form');
var input = document.getElementById('input');

// Extracting userId and requestId from the body dataset
var userId = document.body.getAttribute('data-user-id');
var requestId = document.body.getAttribute('data-request-id');

if (!userId || !requestId) {
  console.error('Missing userId or requestId for chat functionality. Please ensure you are logged in and have selected a valid request.');
} else {
  console.log('Chat functionality initialized with userId:', userId, 'and requestId:', requestId);
}

form.addEventListener('submit', function(e) {
  e.preventDefault();
  if (input.value && userId && requestId) {
    console.log('Sending message:', input.value);
    socket.emit('chat message', { messageText: input.value, sender: 'user', userId: userId, requestId: requestId });
    input.value = '';
  } else {
    console.error('Cannot send message. Missing userId or requestId.');
  }
});

socket.on('chat message', function(msg) {
  console.log('Message received:', msg);
  var item = document.createElement('li');
  item.textContent = msg.messageText; // Assuming msg is an object with a messageText property
  document.getElementById('messages').appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});

// Request chat history upon connection
socket.on('connect', function() {
  console.log('Connected to chat server. Requesting chat history for userId:', userId, 'and requestId:', requestId);
  if (userId && requestId) {
    socket.emit('request chat history', { userId: userId, requestId: requestId });
  } else {
    console.error('Cannot request chat history. Missing userId or requestId.');
  }
});

socket.on('chat history', function(history) {
  console.log('Chat history received:', history);
  if (Array.isArray(history)) {
    history.forEach(function(msg) {
      var item = document.createElement('li');
      item.textContent = msg.messageText;
      document.getElementById('messages').prepend(item); // Prepend to maintain chronological order
    });
  }
});

socket.on('connect_error', (err) => {
  console.error('Connection error:', err.message, err.stack);
});