const express = require('express');
const axios = require('axios');
const Request = require('../models/Request');
const { isAuthenticated } = require('./middleware/authMiddleware');
const { generateTeam } = require('../utils/teamGeneration');
const parseOpenAiResponse = require('../utils/parseOpenAiResponse').parseOpenAiResponse; // Corrected import of the utility function

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

    // Use the utility function to parse the OpenAI response
    try {
      const { taskType, requirements, urgency } = parseOpenAiResponse(messageContent);
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
          res.status(201).json({ success: true, request: newRequest, teamId: team._id, message: "Request submitted successfully. Team generation in progress.", redirectUrl: `/chat?requestId=${team._id}` }); // Corrected redirectUrl to use team._id
        })
        .catch(error => {
          console.error('Failed to generate team:', error.message, error.stack);
          console.error('Error details:', error.response ? error.response.data : error.message); // Log detailed error message from the external service or error message if response is not available
          res.status(500).json({ success: false, message: "Failed to generate team due to an error with generating profiles. Please try again later." });
        });
    } catch (error) {
      console.error('Failed to parse OpenAI response:', error.message, error.stack);
      res.status(400).json({ success: false, message: "Failed to parse OpenAI response. Please ensure your request is correctly formatted." });
    }
  } catch (error) {
    console.error('Failed to process request:', error.message, error.stack);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;