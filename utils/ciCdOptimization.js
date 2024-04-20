const axios = require('axios');
const fs = require('fs');
require('dotenv').config();

//  {GITHUB_ACTIONS_CI_URL} - Set your GitHub Actions CI URL in the .env file
//  {GITHUB_API_TOKEN} - Set your GitHub API token in the .env file
//  {SLACK_WEBHOOK_URL} - Set your Slack Webhook URL for notifications in the .env file

const cacheFilePath = './buildCache.json';

const loadCache = () => {
  try {
    if (fs.existsSync(cacheFilePath)) {
      const cacheData = fs.readFileSync(cacheFilePath);
      return JSON.parse(cacheData);
    }
    return {};
  } catch (error) {
    console.error('Error loading cache:', error.message, error.stack);
    return {};
  }
};

const cache = loadCache();

const checkCacheBeforeBuild = (repoName) => {
  console.log(`Checking cache for repo: ${repoName}`);
  if (cache[repoName]) {
    console.log(`Cache hit for repo: ${repoName}. Skipping build.`);
    return true;
  }
  console.log(`Cache miss for repo: ${repoName}. Proceeding with build.`);
  return false;
};

const updateCacheAfterBuild = (repoName) => {
  console.log(`Updating cache for repo: ${repoName}`);
  cache[repoName] = true;
  try {
    fs.writeFileSync(cacheFilePath, JSON.stringify(cache));
    console.log(`Cache for repo: ${repoName} updated successfully.`);
  } catch (error) {
    console.error('Error updating cache:', error.message, error.stack);
  }
};

const sendNotification = async (message) => {
  try {
    console.log(`Sending notification: ${message}`);
    await axios.post(process.env.SLACK_WEBHOOK_URL, { text: message });
    console.log('Notification sent successfully.');
  } catch (error) {
    console.error('Error sending notification:', error.message, error.stack);
  }
};

const generateBuildReport = (buildStatus) => {
  console.log(`Generating build report for status: ${buildStatus}`);
  // Placeholder for build report generation logic
  const report = `Build status: ${buildStatus}`;
  console.log(`Build report generated: ${report}`);
  return report;
};

const optimizeBuildProcess = () => {
  console.log('Optimizing build process');
  // Placeholder for build process optimization logic
};

module.exports = {
  checkCacheBeforeBuild,
  updateCacheAfterBuild,
  sendNotification,
  generateBuildReport,
  optimizeBuildProcess,
};