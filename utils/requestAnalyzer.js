const { callOpenAiApi } = require('./apiIntegrations');

/**
 * Analyzes a user request to identify the type of team required.
 * @param {string} requestText The user's request text.
 * @returns {Promise<string>} The identified team type.
 */
async function analyzeRequest(requestText) {
  const prompt = `Given the following request: "${requestText}", identify the type of team required to fulfill this request.`;
  try {
    const response = await callOpenAiApi(prompt);
    console.log("Request analysis completed successfully.");
    return response.choices[0].text.trim();
  } catch (error) {
    console.error('Error analyzing user request:', error.response ? error.response.data : error.message);
    console.error(error.stack);
    throw error;
  }
}

module.exports = { analyzeRequest };