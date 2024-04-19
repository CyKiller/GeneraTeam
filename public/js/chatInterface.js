var socket = io();

document.addEventListener('DOMContentLoaded', function() {
  var form = document.getElementById('form');
  var input = document.getElementById('input');
  var messagesContainer = document.getElementById('messages');
  var userId = document.body.getAttribute('data-user-id');
  var requestId = document.body.getAttribute('data-request-id');

  if (!userId || !requestId) {
    console.error('Missing userId or requestId for chat functionality. Please ensure you are logged in and have selected a valid request.');
    alert('Missing userId or requestId. You will be redirected to the homepage.');
    window.location.href = '/';
  } else {
    console.log('Chat functionality initialized with userId:', userId, 'and requestId:', requestId);
    socket.emit('join room', requestId);
    socket.emit('request chat history', { userId: userId, requestId: requestId });
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (input.value && userId && requestId) {
      console.log('Sending message:', input.value);
      socket.emit('send message', { roomId: requestId, text: input.value, sender: 'user', userId: userId });
      input.value = '';
    } else {
      console.error('Cannot send message. Missing userId or requestId.');
    }
  });

  socket.on('new message', function(data) {
    console.log('Message received:', data.text);
    var item = document.createElement('li');
    item.textContent = data.text; // Assuming data is an object with a text property
    messagesContainer.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
  });

  socket.on('chat history', function(history) {
    console.log('Chat history received:', history);
    if (Array.isArray(history)) {
      history.forEach(function(msg) {
        var item = document.createElement('li');
        item.textContent = msg.messageText;
        messagesContainer.prepend(item); // Prepend to maintain chronological order
      });
    }
  });

  socket.on('connect_error', (err) => {
    console.error('Connection error:', err.message, err.stack);
  });
});