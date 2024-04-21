var socket = io();

document.addEventListener('DOMContentLoaded', function() {
  var chatForm = document.getElementById('chatForm');
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
  }

  chatForm.addEventListener('submit', function(e) {
    e.preventDefault();
    if (input.value && userId && requestId) {
      console.log('Sending message:', input.value);
      socket.emit('send message', { roomId: requestId, messageText: input.value, sender: 'user', userId: userId });
      input.value = ''; // Clear input after sending
    } else {
      console.error('Cannot send message. Missing userId or requestId.');
      alert('Cannot send message due to missing information. Please ensure you are logged in and have selected a valid request.');
    }
  });

  socket.on('new message', function(data) {
    console.log('Message received:', data.messageText);
    var item = document.createElement('div');
    item.classList.add('chat-message');
    item.innerHTML = `<strong>${data.sender}:</strong> ${data.messageText}`;
    messagesContainer.appendChild(item);
    messagesContainer.scrollTo(0, messagesContainer.scrollHeight); // Auto-scroll to bottom
  });

  socket.on('connect_error', (err) => {
    console.error('Connection error:', err.message, err.stack);
    alert('Error connecting to chat service. Please try again later.');
  });

  document.getElementById('feedbackForm').addEventListener('submit', function(e) {
    e.preventDefault();
    var satisfaction = document.getElementById('satisfaction').value;
    var feedbackData = { requestId: requestId, userSatisfaction: satisfaction };
    
    fetch('/api/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(feedbackData),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('Feedback submitted:', data);
      alert('Thank you for your feedback!');
    })
    .catch((error) => {
      console.error('Error submitting feedback:', error.message, error.stack);
    });
  });

  // Fetch chat history on page load
  fetch(`/api/chat/history?requestId=${requestId}&userId=${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to fetch chat history');
    }
    return response.json();
  })
  .then(data => {
    console.log('Chat history loaded');
    if (data.length === 0) {
      console.log('No chat history found for this project.');
    } else {
      data.forEach(msg => {
        var item = document.createElement('div');
        item.classList.add('chat-message');
        item.innerHTML = `<strong>${msg.sender}:</strong> ${msg.messageText}`;
        messagesContainer.appendChild(item);
      });
    }
    messagesContainer.scrollTo(0, messagesContainer.scrollHeight); // Auto-scroll to bottom
  })
  .catch((error) => {
    console.error('Error loading chat history:', error.message, error.stack);
  });

  socket.on('new message notification', function(data) {
    if (data.roomId !== requestId) { // Check if the notification is not for the current room
      console.log(`New message in room ${data.roomId}: ${data.message}`);
      // Implement more sophisticated notification handling as needed
      // For example, display a visual indicator for unread messages
    }
  });
});