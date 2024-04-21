const { analyzeRequest } = require('./requestAnalyzer');
const { generateTeamMembers } = require('./teamGenerator');
const Team = require('../models/Team');

/**
 * Handles the generation of a virtual team based on a user's request.
 * @param {string} requestId The ID of the user request.
 * @param {string} requestText The text of the user request.
 * @returns {Promise<void>} Nothing.
 */
async function generateTeamFromRequest(requestId, requestText) {
  try {
    console.log(`Starting team generation for request: ${requestId}`);
    const teamType = await analyzeRequest(requestText);
    console.log(`Team type identified as ${teamType} for request: ${requestId}`);
    const teamMembers = await generateTeamMembers(teamType);
    console.log(`Team members generated for request: ${requestId}`);

    // Save generated team to the database
    const newTeam = new Team({
      requestId,
      profiles: JSON.stringify(teamMembers), // Storing profiles as a JSON string
    });
    await newTeam.save();
    console.log(`Team generated and saved for request ${requestId}`);
  } catch (error) {
    console.error('Error generating team from request:', error.message, error.stack);
    throw error;
  }
}

module.exports = { generateTeamFromRequest };