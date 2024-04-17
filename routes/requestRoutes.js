const express = require('express');
const axios = require('axios');
const Request = require('../models/Request');
const { isAuthenticated } = require('./middleware/authMiddleware');
const { generateTeam } = require('../utils/teamGeneration');

const router = express.Router();

router.post('/api/requests', isAuthenticated, async (req, res) => {
  const { requestText } = req.body;
  const userId = req.session.userId;

  if (!userId || !requestText) {
    console.log("Missing userId or requestText in the request body.");
    return res.status(400).json({ success: false, message: "Missing userId or requestText in the request body." });
  }

  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: "gpt-3.5-turbo", // Updated to use the latest model as per user feedback
      messages: [{
        role: "system",
        content: `Extract task type, requirements, and urgency from the following request:\n\n${requestText}`
      }],
      temperature: 0.5,
      max_tokens: 1500,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` // Correctly using environment variable for API key
      }
    });

    if (!response.data.choices || response.data.choices.length === 0 || !response.data.choices[0].message || !response.data.choices[0].message.content) {
      console.error('OpenAI API response is missing expected data.');
      return res.status(500).json({ success: false, message: "OpenAI API response is missing expected data." });
    }

    const extractedData = response.data.choices[0].message.content.trim();
    console.log(`Extracted data from OpenAI: ${extractedData}`);

    // Attempt to parse the extracted data as JSON
    let taskType, requirements, urgency;
    try {
      const parsedData = JSON.parse(extractedData);
      taskType = parsedData.taskType;
      requirements = parsedData.requirements;
      urgency = parsedData.urgency;
    } catch (parseError) {
      console.error('Error parsing extracted data:', parseError.message, parseError.stack);
      return res.status(400).json({ success: false, message: "Failed to parse extracted data from the user's request." });
    }

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