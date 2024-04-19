const axios = require('axios');

/**
 * Dynamically parses the response from OpenAI API to extract key information for team generation.
 * This function aims to be more adaptable to different response formats.
 * @param {string} responseText - The text response from OpenAI API.
 * @returns {Object} Extracted data including task type, requirements, and urgency.
 */
function parseOpenAiResponse(responseText) {
  console.log("Parsing OpenAI API response for key information.");

  // Initialize variables to hold extracted information
  let taskType;
  let requirements = [];
  let urgency;

  // Attempt to dynamically parse the response
  try {
    const lines = responseText.split('\n');
    let rolesStarted = false; // Flag to indicate if the parsing of roles has started
    lines.forEach(line => {
      // Dynamically identify task type based on keywords
      if (!taskType && line.toLowerCase().includes('specializing in')) {
        const startIndex = line.toLowerCase().indexOf('specializing in') + 'specializing in'.length;
        taskType = line.substring(startIndex).trim().split(',')[0]; // Assuming the first item after 'specializing in' is the task type
      }

      // Dynamically identify requirements based on the structured list of roles
      if (line.toLowerCase().includes('key roles')) {
        rolesStarted = true; // Start parsing roles
      }
      if (rolesStarted) {
        if (line.match(/^\d+\./)) { // Matches lines starting with a number followed by a dot
          const role = line.substring(line.indexOf('.') + 1).trim();
          if (role) requirements.push(role);
        }
      }

      // Identify urgency based on keywords
      if (!urgency && (line.toLowerCase().includes('as soon as possible') || line.toLowerCase().includes('urgent'))) {
        urgency = 'High';
      } else if (!urgency && (line.toLowerCase().includes('no rush') || line.toLowerCase().includes('whenever'))) {
        urgency = 'Low';
      }
    });

    // Fallback values if not set
    if (!taskType) taskType = 'General Software Development';
    if (requirements.length === 0) requirements.push('General Development Skills');
    if (!urgency) urgency = 'Medium';

    // Convert requirements array to a string for simplicity
    let requirementsString = requirements.join(', ');

    console.log("Successfully parsed OpenAI API response.");
    return { taskType, requirements: requirementsString, urgency };
  } catch (error) {
    console.error('Error parsing OpenAI API response:', error.message, error.stack);
    throw error; // Rethrow to handle it in the calling function
  }
}

module.exports = { parseOpenAiResponse };