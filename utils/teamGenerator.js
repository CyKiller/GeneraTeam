const { callOpenAiApi } = require('./apiIntegrations');

/**
 * Generates profiles for virtual team members based on the team type.
 * @param {string} teamType The type of team required.
 * @returns {Promise<Array>} An array of generated team member profiles.
 */
async function generateTeamMembers(teamType) {
  const prompt = `Generate detailed profiles for a ${teamType} team, including roles, expertise, and background.`;
  try {
    const response = await callOpenAiApi(prompt);
    // Assuming the response is a JSON string of team member profiles for simplicity
    console.log(`Team members generated successfully for team type: ${teamType}`);
    return JSON.parse(response.choices[0].text.trim());
  } catch (error) {
    console.error('Error generating team members:', error.response ? error.response.data : error.message);
    console.error(error.stack);
    throw error;
  }
}

module.exports = { generateTeamMembers };