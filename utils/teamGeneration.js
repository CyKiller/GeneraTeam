const axios = require('axios');
const Team = require('../models/Team');

async function generateTeam(requestId, taskDetails) {
  try {
    // Assuming taskDetails contains the structured information about the task type, requirements, and urgency
    const { taskType, requirements } = taskDetails;

    console.log(`Generating team for request ${requestId} with task type: ${taskType} and requirements: ${requirements}`);

    // Use OpenAI's GPT-3 API to generate team member profiles
    const profilesResponse = await axios.post('https://api.openai.com/v1/completions', {
      model: "gpt-3.5-turbo",
      prompt: `Generate detailed profiles for a team working on a ${taskType} project with the following requirements: ${requirements}. Include hypothetical backgrounds, areas of expertise, and personality traits.`,
      temperature: 0.6,
      max_tokens: 16000,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` // {Your OpenAI API key}
      }
    });

    const profiles = profilesResponse.data.choices[0].text.trim();
    console.log(`Generated profiles: ${profiles}`);

    // Store generated team profiles in MongoDB
    const newTeam = await Team.create({
      requestId,
      profiles
    });

    console.log(`New team created with ID: ${newTeam._id} for request ${requestId}`);
    return newTeam;
  } catch (error) {
    console.error('Failed to generate team:', error.message);
    console.error(error.stack);
    throw error;
  }
}

module.exports = { generateTeam };