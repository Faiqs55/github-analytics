const axios = require('axios');
const pc = require('picocolors');

// Initialize a pre-configured Axios client instance
const githubClient = axios.create({
  baseURL: 'https://api.github.com',
  timeout: 8000, // Hard 8-second ceiling to handle API slowness
  headers: {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'Git-Health-CLI-Assessment'
  }
});

// Inject Github Token
if (process.env.GITHUB_TOKEN) {
  githubClient.defaults.headers.common['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
}


//  Centered Error Handling
function handleApiError(error) {
  if (error.code === 'ECONNABORTED') {
    console.error(pc.red('\n API Slowdown Error: The GitHub API took too long to respond (8s limit exceeded).'));
    console.error(pc.yellow('Please check your network connection or try again shortly.\n'));
    process.exit(1);
  }

  if (error.response) {
    const status = error.response.status;

    if (status === 404) {
      console.error(pc.red('\n Error: The GitHub user could not be found.'));
      console.error(pc.yellow('Please check the spelling and try again.\n'));
      process.exit(1);
    }

    if (status === 403 && error.response.headers['x-ratelimit-remaining'] === '0') {
      const resetTimeUnix = parseInt(error.response.headers['x-ratelimit-reset'], 10);
      const minutesRemaining = Math.ceil((new Date(resetTimeUnix * 1000) - new Date()) / 1000 / 60);

      console.error(pc.red('\n Rate Limit Exhausted: You have used up your unauthenticated API calls (60/hr).'));
      console.error(pc.yellow(` Your limit will reset in approximately ${minutesRemaining} minute(s).`));
      console.error(pc.cyan('To bypass this, execute the tool with a personal access token:'));
      console.error(pc.bold('GITHUB_TOKEN=your_token_here npm start -- username\n'));
      process.exit(1);
    }
  }

  console.error(pc.red(`\n Network Connection Error: ${error.message}\n`));
  process.exit(1);
}

// Logic
async function getUserProfile(username) {
  try {
    const response = await githubClient.get(`/users/${username}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}

async function getUserRepos(username) {
  try {
    const response = await githubClient.get(`/users/${username}/repos?per_page=100&sort=updated`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}

async function getRepoLanguages(username, repoName) {
  try {
    const response = await githubClient.get(`/repos/${username}/${repoName}/languages`);
    return response.data || {};
  } catch (error) {
    // Incase of an error fetching languages for a specific repo, we log it but return an empty object to allow the audit to continue
    return {};
  }
}

module.exports = {
  getUserProfile,
  getUserRepos,
  getRepoLanguages
};