const fs = require('fs/promises');
const path = require('path');
const pc = require('picocolors');

async function generateMarkdownReport(username, profile, auditResults) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  let markdownContent = `# 📊 Git-Health Profile Audit: ${username}\n`;
  markdownContent += `> *Generated on: ${currentDate}*\n\n`;
  
  markdownContent += `## 👤 Developer Profile\n`;
  markdownContent += `* **Name:** ${profile.name || 'Not Specified'}\n`;
  markdownContent += `* **Bio:** ${profile.bio || 'No bio provided.'}\n`;
  markdownContent += `* **Public Repositories:** ${profile.public_repos}\n`;
  markdownContent += `* **Followers:** ${profile.followers}\n\n`;

  markdownContent += `## 💻 True Language Stack Breakdown\n`;
  markdownContent += `*Computed across public repositories by aggregated code byte sizes.*\n\n`;

  if (auditResults.languagesDistribution.length === 0) {
    markdownContent += `_No programming language metrics discovered in public repositories._\n\n`;
  } else {
    // Markdown table formatting
    markdownContent += `| Language | Percentage | Total Code Size |\n`;
    markdownContent += `| :--- | :---: | :---: |\n`;
    
    auditResults.languagesDistribution.forEach(item => {
      markdownContent += `| **${item.language}** | ${item.percentage}% | ${item.bytes.toLocaleString()} bytes |\n`;
    });
    markdownContent += `\n`;
  }

  markdownContent += `## ⚠️ Technical Debt & Stale Projects Auditor\n`;
  
  if (auditResults.staleProjects.length === 0) {
    markdownContent += `### ✅ Clean Bill of Health!\n`;
    markdownContent += `No public repositories have been left abandoned with active open issues over the past 365 days.\n`;
  } else {
    markdownContent += `### 🚨 Attention Required\n`;
    markdownContent += `The system discovered **${auditResults.staleProjects.length}** stale/abandoned projects that contain unresolved open issues and haven't sustained a commit in over a year:\n\n`;

    auditResults.staleProjects.forEach(repo => {
      markdownContent += `* **[${repo.name}](${repo.url})**\n`;
      markdownContent += `  * ⏳ **Days Stale:** ${repo.daysStale} days since last modification\n`;
      markdownContent += `  * 🐛 **Open Issues:** ${repo.openIssues} active issue ticket(s)\n\n`;
    });
  }

  try {
    const outputPath = path.join(process.cwd(), 'report.md');
    await fs.writeFile(outputPath, markdownContent, 'utf8');
    console.log(pc.green(`\n💾 Success: Comprehensive audit saved locally to ${pc.bold('report.md')}`));
  } catch (error) {
    console.error(pc.red(`\n❌ File System Write Error: Unable to save report.md. ${error.message}`));
  }
}

module.exports = {
  generateMarkdownReport
};