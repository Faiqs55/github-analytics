# Git-Health CLI

A professional command-line interface utility built using Node.js to aggregate deep repository language statistics and audit active technical debt/abandoned projects directly from the GitHub REST API.

## Core Utility Features

* **Aggregation Engine:** Hits individual repository endpoints to calculate true programming stack footprints by total code byte values instead of basic repository counts.
* **Technical Debt Auditor:** Automatically scans for public repositories that have gone more than 365 days without a single commit but still contain unresolved open issue metrics.
* **Markdown Exporter:** Automatically compiles your metrics and generates a beautifully formatted `report.md` file at your project root, optimized to copy-paste straight into a GitHub Profile README.

## Local Operational Requirements

* **Node.js** (v16.x or higher recommended)
* **npm** (comes bundled with Node)

## How to Set Up and Run

Follow these quick actions to execute this project on a fresh machine:

1. **Clone and Enter the Directory:**
   ```bash
   git clone https://github.com/Faiqs55/github-analytics.git && cd github-analytics
   ```

2. **Install Core Dependencies:**
   ```bash
   npm install
   ```

3. **Execute the Application:**
   Pass any valid public GitHub username as an argument following the script flag:
   ```bash
   npm start -- octocat
   ```

## 💡 Bypassing GitHub Rate Limits

Unauthenticated requests to the GitHub API are limited to 60 hits per hour. If you run this tool against highly active users or run it multiple times consecutively, you may exhaust this quota.

To expand your limit to 5,000 requests per hour, simply generate a Personal Access Token (PAT) on GitHub and pass it as an environment variable before your launch command:

```bash
GITHUB_TOKEN=your_token_here npm start -- octocat
```