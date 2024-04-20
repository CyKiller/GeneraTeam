const dotenv = require('dotenv');

dotenv.config();

const config = {
  githubApiUrl: process.env.GITHUB_API_URL || 'https://api.github.com', // {GitHub API URL}
  githubApiToken: process.env.GITHUB_API_TOKEN, //  {GitHub API Token}
  githubOwner: process.env.GITHUB_OWNER, // {GitHub Repository Owner}
  githubRepo: process.env.GITHUB_REPO, //  {GitHub Repository Name}
  githubActionsCiUrl: process.env.GITHUB_ACTIONS_CI_URL || 'https://api.github.com/repos', // INPUT_REQUIRED {GitHub Actions CI URL}
};

const getConfig = (key) => {
  if (!config[key]) {
    console.error(`Config error: Missing configuration for ${key}`);
    process.exit(1);
  }
  return config[key];
};

module.exports = {
  getConfig,
};