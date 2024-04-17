const express = require('express');
const axios = require('axios');
const Request = require('../models/Request');
const { isAuthenticated } = require('./middleware/authMiddleware');

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
      model: "gpt-3.5-turbo",
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
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      }
    });

    const extractedData = response.data.choices[0].text.trim();
    console.log(`Extracted data from OpenAI: ${extractedData}`);

    // Attempt to parse the extracted data as JSON
    let taskType, requirements, urgency;
    try {
      const parsedData = JSON.parse(extractedData);
      taskType = parsedData.taskType;
      requirements = parsedData.requirements;
      urgency = parsedData.urgency;
    } catch (parseError) {
      console.error('Error parsing extracted data:', parseError);
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
    res.status(201).json({ success: true, request: newRequest });
  } catch (error) {
    console.error('Failed to process request:', error.message);
    console.error(error.stack);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;