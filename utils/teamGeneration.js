const axios = require('axios');
const Team = require('../models/Team');

async function generateTeam(requestId, taskDetails) {
  try {
    // Assuming taskDetails contains the structured information about the task type, requirements, and urgency
    const { taskType, requirements } = taskDetails;

    console.log(`Generating team for request ${requestId} with task type: ${taskType} and requirements: ${requirements}`);

    // Validate taskType and requirements before sending the request
    if (!taskType || !requirements) {
      console.error('Task type or requirements missing for team generation.');
      throw new Error('Task type or requirements missing for team generation.');
    }

    // Adjusting the prompt to ensure clarity and correctness for the OpenAI API request
    const prompt = `Generate detailed profiles for a team working on a project with the following characteristics: Task Type - ${taskType}; Requirements - ${requirements}. Include hypothetical backgrounds, areas of expertise, and personality traits.`;

    console.log(`Sending request to OpenAI API with prompt: ${prompt}`);

    // Use OpenAI's GPT-3 API to generate team member profiles
    const profilesResponse = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: "gpt-3.5-turbo", // Adjusted to the latest model for better performance
      messages: [{
        role: "system",
        content: prompt
      }],
      max_tokens: 1024, // Adjusted max_tokens for detailed responses
      temperature: 0.5, // Adjusted temperature for more predictable outputs
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` // INPUT_REQUIRED {Your OpenAI API key}
      }
    });

    console.log("Received response from OpenAI API:", profilesResponse.data);

    // Adjusting the extraction of generated profiles from the OpenAI API response
    let profiles;
    if (profilesResponse.data.choices && profilesResponse.data.choices.length > 0 && profilesResponse.data.choices[0].message && profilesResponse.data.choices[0].message.content) {
      profiles = profilesResponse.data.choices[0].message.content.trim();
      console.log(`Generated profiles: ${profiles}`);
    } else {
      console.error('Failed to generate team: No profiles data returned from API or profiles data is invalid.', profilesResponse.data);
      throw new Error('No profiles data returned from API or profiles data is invalid.');
    }

    // Store generated team profiles in MongoDB
    const newTeam = await Team.create({
      requestId,
      profiles
    });

    console.log(`New team created with ID: ${newTeam._id} for request ${requestId}`);
    return newTeam;
  } catch (error) {
    console.error('Failed to generate team:', error.message, error.stack);
    throw error;
  }
}

module.exports = { generateTeam };