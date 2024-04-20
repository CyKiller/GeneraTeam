const axios = require('axios');
require('dotenv').config();

// Function to check if the deployment conditions are met
const isDeploymentConditionMet = async (owner, repo, branch = 'main') => {
  try {
    console.log(`Checking deployment conditions for ${owner}/${repo} on branch ${branch}`);
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/commits/${branch}`;
    const response = await axios.get(apiUrl, {
      headers: {
        'Authorization': `Bearer ${process.env.GITHUB_API_TOKEN}`, // Ensure your GitHub API token is correctly set in the .env file
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (response.status === 200) {
      console.log(`Latest commit on ${branch} fetched successfully.`);
      // Example condition: Check if the latest commit message contains a specific keyword for deployment
      const commitMessage = response.data.commit.message;
      if (commitMessage.includes('[deploy]')) {
        console.log('Deployment condition met: Latest commit message contains [deploy].');
        return true;
      } else {
        console.log('Deployment condition not met: Latest commit message does not contain [deploy].');
        return false;
      }
    } else {
      console.log(`Failed to fetch the latest commit on ${branch}.`);
      return false;
    }
  } catch (error) {
    console.error(`Error checking deployment conditions: ${error.message}`, error.stack);
    // Handling rate limit and network errors specifically
    if (error.response && error.response.status === 403) {
      console.error('GitHub API rate limit exceeded. Please try again later.');
    } else if (error.code === 'ENOTFOUND') {
      console.error('Network error: Unable to reach GitHub API.');
    }
    return false;
  }
};

module.exports = {
  isDeploymentConditionMet
};