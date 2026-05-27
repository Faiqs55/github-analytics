### Phase 1: Foundation & Scaffold (Hours 0 – 4)
* **Goal:** Initialize repository, build configuration, and establish the argument parsing layer.
* **Step 1.1:** Initialize the project using native ECMAScript Modules (`"type": "module"` in `package.json`).
* **Step 1.2:** Configure basic execution scripts and install targeted, low-overhead dependencies (e.g., `axios` for standard HTTP routing, `picocolors` for terminal interface color accents).
* **Step 1.3:** Build the main entry-point file (`index.js` or `bin/main.js`) to read inputs straight from process arguments (`process.argv`).
* **📦 Mandatory Commit:** `feat: initialize project structure and setup native ESM configuration`

### Phase 2: Core Gathering Engine (Hours 4 – 12)
* **Goal:** Connect to the GitHub REST API and pipe sequential data streams into memory objects.
* **Step 2.1:** Code the primary user profile lookup logic (`/users/{username}`). Extract baseline information.
* **Step 2.2:** Code the repository retrieval loop (`/users/{username}/repos`), ensuring pagination parameters are declared to capture more than the default 30 items if the user is highly active.
* **Step 2.3:** Implement concurrent batch requests using `Promise.all` to query the language bytes (`/repos/{owner}/{repo}/languages`) for each repo object found in Step 2.2.
* **Step 2.4:** Build the reducer layer to sum languages into a single map object and sort them in descending order.
* **📦 Mandatory Commit:** `feat: implement user profiling and concurrent repository language aggregation`

### Phase 3: Defensive Engineering & Edge-Cases (Hours 12 – 18)
* **Goal:** Harden the script against hostile testing patterns, timeouts, and quota exhaustion.
* **Step 3.1:** Introduce validation for names containing invalid characters or non-existent handles (`404`).
* **Step 3.2:** Implement an explicit request configuration using an Axios instance with `timeout: 8000`. Add a try/catch block that extracts `error.code === 'ECONNABORTED'` and shows a clean, human-friendly message.
* **Step 3.3:** Add an input guard checking for zero-byte totals inside individual repos to prevent arithmetic calculations from returning `NaN`.
* **Step 3.4:** Add an interceptor or error-block handler reading `error.response.status === 403`. If true, pull the `x-ratelimit-reset` unix timestamp, convert it to minutes, and print standard setup documentation for authentication.
* **📦 Mandatory Commit:** `fix: add api timeout handling, rate limit extraction, and empty repo guards`

### Phase 4: Report Generation & Terminal Polish (Hours 18 – 24)
* **Goal:** Output information beautifully to both the console and a markdown file.
* **Step 4.1:** Format the CLI outputs with clean spacing, ASCII highlights, and color indicators separating code language classes.
* **Step 4.2:** Integrate the Node.js native File System module (`import fs from 'fs/promises'`) to write data out as a highly readable, copy-pasteable Markdown report named `report.md`.
* **📦 Mandatory Commit:** `feat: implement colored terminal reporting and local markdown document export`

### Phase 5: Verification & Review Preparation (Hours 24 – 48)
* **Goal:** Self-audit against all explicit submission instructions on a clean environment.
* **Step 5.1:** Clone the repository into a separate sandbox directory to confirm that running `npm install` and the configured startup command executes correctly on a fresh machine.
* **Step 5.2:** Draft the comprehensive `ANSWERS.md` file using the concrete, defensible arguments prepared during the architectural phases.
* **Step 5.3:** Refine `README.md` to ensure a single, copy-pasteable command works instantly.

---

## 📂 Structural Blueprint

Keep the folder structure highly organized, flat, and obvious so the reviewer instantly understands the layout: