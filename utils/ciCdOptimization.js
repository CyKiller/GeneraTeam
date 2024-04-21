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
  if (process.env.ENABLE_CI_CD === 'true') {
    try {
      console.log(`Sending notification: ${message}`);
      await axios.post(process.env.SLACK_WEBHOOK_URL, { text: message }); // INPUT_REQUIRED {Set your Slack Webhook URL for notifications}
      console.log('Notification sent successfully.');
    } catch (error) {
      console.error('Error sending notification:', error.message, error.stack);
    }
  } else {
    console.log('CI/CD features are disabled. Skipping notification.');
  }
};

const generateBuildReport = (buildStatus) => {
  if (process.env.ENABLE_CI_CD === 'true') {
    console.log(`Generating build report for status: ${buildStatus}`);
    // Placeholder for build report generation logic
    const report = `Build status: ${buildStatus}`;
    console.log(`Build report generated: ${report}`);
    return report;
  } else {
    console.log('CI/CD features are disabled. Skipping build report generation.');
  }
};

const optimizeBuildProcess = () => {
  if (process.env.ENABLE_CI_CD === 'true') {
    console.log('Optimizing build process');
    // Placeholder for build process optimization logic
  } else {
    console.log('CI/CD features are disabled. Skipping build process optimization.');
  }
};

module.exports = {
  checkCacheBeforeBuild,
  updateCacheAfterBuild,
  sendNotification,
  generateBuildReport,
  optimizeBuildProcess,
};