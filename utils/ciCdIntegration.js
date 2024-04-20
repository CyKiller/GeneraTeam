const axios = require('axios');
require('dotenv').config();

// Helper function to check if conditions are met for triggering CI/CD actions
function conditionsMet(conditions) {
    // Example condition: only trigger on main branch
    if (conditions.branch && conditions.branch !== 'main') {
        console.log(`Skipping action as it's not on the main branch.`);
        return false;
    }
    // Add more conditions as needed
    return true;
}

// Function to trigger a build process for GitHub Actions
async function triggerBuild(owner, repo, conditions = {}) {
    try {
        if (!conditionsMet(conditions)) {
            console.log('Build conditions not met, skipping build trigger.');
            return;
        }
        const buildUrl = `${process.env.GITHUB_ACTIONS_CI_URL}/repos/${owner}/${repo}/dispatches`; // {GitHub Actions CI URL}
        const response = await axios.post(buildUrl, {
            event_type: 'build',
            client_payload: {}
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.GITHUB_API_TOKEN}`, // {GitHub API Token}
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        console.log(`Build triggered successfully for ${owner}/${repo}. Response: ${JSON.stringify(response.data)}`);
        return response.data;
    } catch (error) {
        console.error(`Error while triggering build for ${owner}/${repo}. Error: ${error.message}`, error.stack);
        throw error;
    }
}

// Function to trigger tests for GitHub Actions
async function triggerTest(owner, repo, conditions = {}) {
    try {
        if (!conditionsMet(conditions)) {
            console.log('Test conditions not met, skipping test trigger.');
            return;
        }
        const testUrl = `${process.env.GITHUB_ACTIONS_CI_URL}/repos/${owner}/${repo}/dispatches`; // {GitHub Actions CI URL}
        const response = await axios.post(testUrl, {
            event_type: 'test',
            client_payload: {}
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.GITHUB_API_TOKEN}`, // {GitHub API Token}
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        console.log(`Test triggered successfully for ${owner}/${repo}. Response: ${JSON.stringify(response.data)}`);
        return response.data;
    } catch (error) {
        console.error(`Error while triggering test for ${owner}/${repo}. Error: ${error.message}`, error.stack);
        throw error;
    }
}

// Function to trigger a deployment process for GitHub Actions
async function triggerDeploy(owner, repo, conditions = {}) {
    try {
        if (!conditionsMet(conditions)) {
            console.log('Deploy conditions not met, skipping deploy trigger.');
            return;
        }
        const deployUrl = `${process.env.GITHUB_ACTIONS_CI_URL}/repos/${owner}/${repo}/dispatches`; // {GitHub Actions CI URL}
        const response = await axios.post(deployUrl, {
            event_type: 'deploy',
            client_payload: {}
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.GITHUB_API_TOKEN}`, // {GitHub API Token}
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        console.log(`Deploy triggered successfully for ${owner}/${repo}. Response: ${JSON.stringify(response.data)}`);
        return response.data;
    } catch (error) {
        console.error(`Error while triggering deploy for ${owner}/${repo}. Error: ${error.message}`, error.stack);
        throw error;
    }
}

module.exports = {
    triggerBuild,
    triggerTest,
    triggerDeploy,
};