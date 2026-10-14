import fs from 'fs';
import path from 'path';

// ANSI escape codes for colored terminal logs
const c = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    cyan: '\x1b[36m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    magenta: '\x1b[35m',
    gray: '\x1b[90m'
};

const logHeader = (title) => {
    console.log(`\n${c.cyan}${c.bright}--- [ ${title.toUpperCase()} ] ---${c.reset}`);
};

const logStep = (stepNum, category, message) => {
    console.log(`${c.magenta}[Step ${stepNum}]${c.reset} [${category.toUpperCase()}] ${message}`);
};

const logSuccess = (category, message) => {
    console.log(`${c.green}[SUCCESS] [${category.toUpperCase()}]${c.reset} 🧹 ${message}`);
};

const logWarning = (category, message) => {
    console.log(`${c.yellow}[WARNING] [${category.toUpperCase()}]${c.reset} ⚠️ ${message}`);
};

const logDetail = (message) => {
    console.log(`    ${c.gray}-> ${message}${c.reset}`);
};

logHeader('Cleanup Pipeline Initialization');
console.log(`${c.bright}Timestamp :${c.reset} ${new Date().toISOString()}`);

const targets = ['dist', 'release'];

logHeader('Executing Workspace Sanitization');

targets.forEach((target, index) => {
    const resolvedPath = path.resolve(target);
    logStep(index + 1, 'CLEANUP', `Inspecting target directory: "${target}"`);

    if (fs.existsSync(resolvedPath)) {
        logDetail(`Found existing directory at "${resolvedPath}". Purging recursively...`);
        try {
            // Fixed: rmSync with recursive & force safely deletes non-empty folders
            fs.rmSync(resolvedPath, { recursive: true, force: true });
            logSuccess('CLEANUP', `Successfully purged "${target}/" directory.`);
        } catch (err) {
            logWarning('CLEANUP', `Failed to remove "${target}/": ${err.message}`);
        }
    } else {
        logDetail(`Target "${target}/" does not exist on disk. Skipping.`);
    }
});

logHeader('Cleanup Pipeline Completed');
console.log(`${c.green}${c.bright}[READY] Workspace is pristine and clean.${c.reset} ✨\n`);