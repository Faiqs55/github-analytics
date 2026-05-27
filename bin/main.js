const pc = require('picocolors');
const { getUserProfile, getUserRepos } = require('../src/api');
const { auditUserRepositories } = require('../src/auditor');

async function main() {
  // Get the GitHub username from command-line arguments
  const username = process.argv[2];

  if (!username) {
    console.error(pc.red('\n Error: Please provide a GitHub username.'));
    console.log(pc.yellow(' Usage: npm start -- <username>\n'));
    process.exit(1);
  }

  console.log(pc.cyan(`\n🔍 Initializing Git-Health Audit for user: ${pc.bold(username)}...`));

  // Flow of the main execution:
  const profile = await getUserProfile(username);
  const repos = await getUserRepos(username);

  // Process the repositories to extract language metrics and staleness indicators
  const auditResults = await auditUserRepositories(username, repos);

  //  Rendering
  console.log(pc.green('\n=================================================='));
  console.log(pc.bold(pc.green(`    GIT-HEALTH AUDIT REPORT: ${username.toUpperCase()}`)));
  console.log(pc.green('=================================================='));
  
  console.log(`\n👤 ${pc.bold('Developer Profile:')}`);
  console.log(`   • Name:       ${profile.name || 'Not Specified'}`);
  console.log(`   • Public Repos: ${profile.public_repos}`);
  console.log(`   • Followers:    ${profile.followers}`);
  console.log(`   • Bio:          ${profile.bio || 'No bio provided'}`);

  console.log(`\n💻 ${pc.bold('True Language Stack Breakdown (by raw code bytes):')}`);
  if (auditResults.languagesDistribution.length === 0) {
    console.log(pc.gray('   No language metrics found (empty or uninitialized repositories).'));
  } else {
    auditResults.languagesDistribution.forEach(item => {
      console.log(`   • ${pc.magenta(item.language.padEnd(15))} → ${pc.bold(item.percentage)}% (${item.bytes.toLocaleString()} bytes)`);
    });
  }

  console.log(`\n ${pc.bold('Technical Debt / Stale Project Auditor:')}`);
  if (auditResults.staleProjects.length === 0) {
    console.log(pc.green('    Clean Bill of Health! No abandoned repositories with open issues found.'));
  } else {
    console.log(pc.yellow(`   Found ${auditResults.staleProjects.length} stale/abandoned repository paths needing attention:\n`));
    auditResults.staleProjects.forEach(repo => {
      console.log(`    ${pc.red(repo.name)}`);
      console.log(`      • Days since update: ${pc.bold(repo.daysStale)} days`);
      console.log(`      • Active open issues: ${pc.bold(repo.openIssues)} issue(s)`);
      console.log(`      • Repository Link:   ${pc.gray(repo.url)}`);
      console.log();
    });
  }
  console.log(pc.green('==================================================\n'));
  
}

main().catch(err => {
  console.error(pc.red('Fatal unexpected execution error:'), err);
  process.exit(1);
});