const { getRepoLanguages } = require('./api');

function calculateDaysAgo(dateString) {
  const pastDate = new Date(dateString);
  const today = new Date();
  const differenceInTime = today.getTime() - pastDate.getTime();
  return Math.floor(differenceInTime / (1000 * 3600 * 24));
}

 // Auditing Service
async function auditUserRepositories(username, repositories) {
  const languageGlobalMap = {};
  let totalGlobalBytes = 0;
  const staleRepositories = [];

  console.log(`\nAnalyzing ${repositories.length} public repositories...`);

  // Loop through all repositories to parse metrics
  for (const repo of repositories) {
    // Technical Debt / Staleness Check
    const daysSinceUpdate = calculateDaysAgo(repo.updated_at);
    
    if (daysSinceUpdate >= 365 && repo.open_issues_count > 0) {
      staleRepositories.push({
        name: repo.name,
        daysStale: daysSinceUpdate,
        openIssues: repo.open_issues_count,
        url: repo.html_url
      });
    }

    // Language Bytes Fetching
    const repoLanguages = await getRepoLanguages(username, repo.name);

    // Sum up the bytes into our global map tracker
    for (const [language, bytes] of Object.entries(repoLanguages)) {
      if (!languageGlobalMap[language]) {
        languageGlobalMap[language] = 0;
      }
      languageGlobalMap[language] += bytes;
      totalGlobalBytes += bytes;
    }
  }

  // Calculate percentage distribution for each language
  const languagePercentages = [];
  if (totalGlobalBytes > 0) {
    for (const [language, bytes] of Object.entries(languageGlobalMap)) {
      const percentage = ((bytes / totalGlobalBytes) * 100).toFixed(1);
      languagePercentages.push({
        language,
        bytes,
        percentage: parseFloat(percentage)
      });
    }
    // Sorting
    languagePercentages.sort((a, b) => b.bytes - a.bytes);
  }

  return {
    totalGlobalBytes,
    languagesDistribution: languagePercentages,
    staleProjects: staleRepositories
  };
}

module.exports = {
  auditUserRepositories
};