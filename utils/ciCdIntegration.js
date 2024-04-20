const axios = require('axios');
require('dotenv').config();

// Extend the existing functions or add new ones if necessary

// Function to trigger a build process for GitHub Actions or other CI/CD services
async function triggerBuild(projectId) {
    try {
        const buildUrl = `${process.env.GITHUB_ACTIONS_CI_URL}/repos/{owner}/{repo}/dispatches`; // {Replace {owner} and {repo} with your GitHub repository details}
        const response = await axios.post(buildUrl, {
            event_type: 'build', // Customize this as per your GitHub Actions setup
            client_payload: { projectId: projectId }
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.GITHUB_API_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        console.log(`Build triggered successfully for project ID: ${projectId}. Response: ${JSON.stringify(response.data)}`);
        return response.data;
    } catch (error) {
        console.error(`Error while triggering build for project ID: ${projectId}. Error: ${error.message}`, error.stack);
        throw error;
    }
}

// Similarly, you can define functions for triggering tests and deployment
// For simplicity, let's assume the same GitHub Actions workflow handles build, test, and deploy through different jobs or steps within the same workflow. 
// In a real-world scenario, you might have separate functions with different endpoints or payloads to specifically trigger test and deploy actions.

async function testProject(projectId) {
    // Assuming the same function can trigger tests, customize as needed for your setup
    return triggerBuild(projectId); // Reusing triggerBuild for demonstration. Customize as needed.
}

async function deployProject(projectId) {
    // Assuming the same function can trigger deployment, customize as needed for your setup
    return triggerBuild(projectId); // Reusing triggerBuild for demonstration. Customize as needed.
}

module.exports = {
    buildProject: triggerBuild,
    testProject, // For demonstration, using the same function. Customize as needed.
    deployProject, // For demonstration, using the same function. Customize as needed.
};