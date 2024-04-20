const axios = require('axios');
require('dotenv').config();

// Function to trigger a build process
async function buildProject(projectId) {
    console.log(`Initiating build process for project ID: ${projectId}`);
    try {
        const buildUrl = process.env.CI_BUILD_TRIGGER_URL; // CI/CD service build trigger URL from environment variables
        const response = await axios.post(buildUrl, { projectId });
        console.log(`Build process initiated successfully for project ID: ${projectId}, response: ${response.data}`);
    } catch (error) {
        console.error(`Error initiating build process for project ID: ${projectId}`, error.message, error.stack);
        throw error;
    }
}

// Function to trigger a test process
async function testProject(projectId) {
    console.log(`Initiating test process for project ID: ${projectId}`);
    try {
        const testUrl = process.env.CI_TEST_TRIGGER_URL; // CI/CD service test trigger URL from environment variables
        const response = await axios.post(testUrl, { projectId });
        console.log(`Test process initiated successfully for project ID: ${projectId}, response: ${response.data}`);
    } catch (error) {
        console.error(`Error initiating test process for project ID: ${projectId}`, error.message, error.stack);
        throw error;
    }
}

// Function to trigger a deployment process
async function deployProject(projectId) {
    console.log(`Initiating deployment process for project ID: ${projectId}`);
    try {
        const deployUrl = process.env.CI_DEPLOY_TRIGGER_URL; // CI/CD service deployment trigger URL from environment variables
        const response = await axios.post(deployUrl, { projectId });
        console.log(`Deployment process initiated successfully for project ID: ${projectId}, response: ${response.data}`);
    } catch (error) {
        console.error(`Error initiating deployment process for project ID: ${projectId}`, error.message, error.stack);
        throw error;
    }
}

module.exports = {
    buildProject,
    testProject,
    deployProject,
};