const express = require('express');
const axios = require('axios');
const Request = require('../models/Request');
const { isAuthenticated } = require('./middleware/authMiddleware');
const { generateTeam } = require('../utils/teamGeneration');

const router = express.Router();

router.post('/api/requests', isAuthenticated, async (req, res) => {
  console.log("Received request submission:", req.body); // Added logging for debugging
  const { requestText } = req.body;
  const userId = req.session.userId;

  if (!userId || !requestText) {
    console.log("Missing userId or requestText in the request body.");
    return res.status(400).json({ success: false, message: "Missing userId or requestText in the request body." });
  }

  try {
    console.log("Sending request to OpenAI API"); // Log the action of sending a request
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant who specialize in putting together development teams." },
        { role: "user", content: requestText }
      ]
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      }
    });

    console.log("Received response from OpenAI API"); // Log receiving the response

    if (!response.data.choices || response.data.choices.length === 0 || !response.data.choices[0].message) {
      console.error('OpenAI API response is missing expected data.', response.data);
      return res.status(500).json({ success: false, message: "OpenAI API response is missing expected data." });
    }

    const messageContent = response.data.choices[0].message.content.trim();
    console.log(`Extracted message content from OpenAI: ${messageContent}`);

    // Splitting the extracted message content by line breaks and parsing it
    const dataLines = messageContent.split('\n');
    let taskType, requirements, urgency;
    dataLines.forEach(line => {
      if (line.startsWith('Task type:')) taskType = line.split(':')[1].trim();
      else if (line.startsWith('Requirements:')) requirements = line.split(':')[1].trim();
      else if (line.startsWith('Urgency:')) urgency = line.split(':')[1].trim();
    });

    // Validate the parsed data
    if (!taskType || !requirements || !urgency) {
      console.log("Extracted data is missing required fields.");
      return res.status(400).json({ success: false, message: "Extracted data is missing required fields." });
    }

    const newRequest = await Request.create({
      userId,
      requestText,
      taskType,
      requirements,
      urgency,
      status: 'Clarified'
    });

    console.log(`New request created with ID: ${newRequest._id}`);

    // Generate team based on the request
    generateTeam(newRequest._id, { taskType, requirements, urgency })
      .then(team => {
        console.log(`Team generated with ID: ${team._id}`);
        if (req.accepts('html')) {
          res.redirect('/team');
        } else {
          res.status(201).json({ success: true, request: newRequest, message: "Request submitted successfully. Team generation in progress." });
        }
      })
      .catch(error => {
        console.error('Failed to generate team:', error.message, error.stack);
        res.status(500).json({ success: false, message: "Failed to generate team." });
      });

  } catch (error) {
    console.error('Failed to process request:', error.message, error.stack);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;