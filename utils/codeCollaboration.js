const { Octokit } = require("@octokit/rest");
const octokit = new Octokit({ auth: process.env.GITHUB_API_TOKEN }); // {Insert your GitHub API token here}

async function createRepo(repoName) {
    try {
        const response = await octokit.rest.repos.createForAuthenticatedUser({
            name: repoName,
        });
        console.log(`Repository created: ${response.data.html_url}`);
        return response.data;
    } catch (error) {
        console.error(`Error creating repository: ${error.message}`, error);
        throw error;
    }
}

async function commitCode(repoOwner, repoName, filePath, fileContent, commitMessage) {
    try {
        const { data: { sha: latestCommitSha } } = await octokit.rest.repos.getCommit({
            owner: repoOwner,
            repo: repoName,
            ref: 'heads/master',
        });

        const { data: { sha: blobSha } } = await octokit.rest.git.createBlob({
            owner: repoOwner,
            repo: repoName,
            content: fileContent,
            encoding: 'utf-8',
        });

        const { data: { sha: treeSha } } = await octokit.rest.git.createTree({
            owner: repoOwner,
            repo: repoName,
            base_tree: latestCommitSha,
            tree: [{
                path: filePath,
                mode: '100644',
                type: 'blob',
                sha: blobSha,
            }],
        });

        const { data: { sha: newCommitSha } } = await octokit.rest.git.createCommit({
            owner: repoOwner,
            repo: repoName,
            message: commitMessage,
            tree: treeSha,
            parents: [latestCommitSha],
        });

        await octokit.rest.git.updateRef({
            owner: repoOwner,
            repo: repoName,
            ref: 'heads/master',
            sha: newCommitSha,
        });

        console.log(`Commit successful: ${commitMessage}`);
    } catch (error) {
        console.error(`Error committing code: ${error.message}`, error);
        throw error;
    }
}

async function mergeChanges(repoOwner, repoName, base, head, commitMessage) {
    try {
        const response = await octokit.rest.repos.merge({
            owner: repoOwner,
            repo: repoName,
            base,
            head,
            commit_message: commitMessage,
        });
        console.log(`Merge successful: ${response.data.sha}`);
        return response.data;
    } catch (error) {
        console.error(`Error merging changes: ${error.message}`, error);
        throw error;
    }
}

module.exports = {
    createRepo,
    commitCode,
    mergeChanges,
};