import * as esbuild from 'esbuild';
import fs from 'fs';
import path from 'path';
import AdmZip from 'adm-zip';
import JavaScriptObfuscator from 'javascript-obfuscator';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const npmstuff = require('./package.json');

const args = process.argv.slice(2);
const isServe = args.includes('--serve');
const isPackage = args.includes('--package');

const distDir = path.resolve('dist');
const releaseDir = path.resolve('release');
const assetsDir = path.resolve('assets');
const distAssetsDir = path.join(distDir, 'assets');

// ANSI escape codes for clean terminal colors
const c = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    cyan: '\x1b[36m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    magenta: '\x1b[35m',
    blue: '\x1b[34m',
    gray: '\x1b[90m'
};

const logHeader = (title) => {
    console.log(`\n${c.cyan}${c.bright}--- [ ${title.toUpperCase()} ] ---${c.reset}`);
};

const logStep = (stepNum, category, message) => {
    console.log(`${c.blue}[Step ${stepNum}]${c.reset} ${c.magenta}[${category.toUpperCase()}]${c.reset} ${message}`);
};

const logSuccess = (category, message) => {
    console.log(`${c.green}[SUCCESS] [${category.toUpperCase()}]${c.reset} ${message}`);
};

const logWarning = (category, message) => {
    console.log(`${c.yellow}[WARNING] [${category.toUpperCase()}]${c.reset} ${message}`);
};

const logDetail = (message) => {
    console.log(`    ${c.gray}-> ${message}${c.reset}`);
};

logHeader('Build Pipeline Initialization');
console.log(`${c.bright}Target Mode    :${c.reset} ${isServe ? 'LIVE SERVE' : isPackage ? 'PRODUCTION & PACKAGING' : 'STANDARD BUILD'}`);
console.log(`${c.bright}Package Name   :${c.reset} ${npmstuff.name} v${npmstuff.version}`);
console.log(`${c.bright}Timestamp      :${c.reset} ${new Date().toISOString()}`);

// 1. Clean and recreate dist folder
logHeader('Environment Sanitization');
logStep(1, 'CLEANUP', `Inspecting directory: ${distDir}`);

if (fs.existsSync(distDir)) {
    logWarning('CLEANUP', 'Existing distribution directory detected. Purging contents recursively.');
    fs.rmSync(distDir, { recursive: true, force: true });
    logSuccess('CLEANUP', 'Distribution directory successfully wiped.');
} else {
    logDetail('Distribution directory does not exist. Skipping purge.');
}

logStep(2, 'SETUP', 'Creating fresh distribution directory.');
fs.mkdirSync(distDir, { recursive: true });
logSuccess('SETUP', 'Directory created successfully.');

// 2. Copy assets folder recursively
logHeader('Asset Synchronization');

function copyRecursiveSync(src, dest, label = 'ASSETS') {
    if (!fs.existsSync(src)) {
        logWarning(label, `Source path "${src}" does not exist. Skipping.`);
        return;
    }

    logDetail(`Ensuring destination exists: ${dest}`);
    fs.mkdirSync(dest, { recursive: true });
    let entries = fs.readdirSync(src, { withFileTypes: true });
    logDetail(`Processing ${entries.length} entry/entries from ${src}`);

    for (let entry of entries) {
        let srcPath = path.join(src, entry.name);
        let destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyRecursiveSync(srcPath, destPath, label);
        } else {
            fs.copyFileSync(srcPath, destPath);
            logDetail(`Copied: ${entry.name} -> ${destPath}`);
        }
    }
}

logStep(3, 'ASSETS', 'Migrating core assets...');
copyRecursiveSync(assetsDir, distAssetsDir, 'CORE');

const phobiaAssets = path.resolve('./.phobia/assets');
if (fs.existsSync(phobiaAssets)) {
    logStep(4, 'PHOBIA', 'Detected secondary asset path. Migrating...');
    copyRecursiveSync(phobiaAssets, path.join(distDir, 'phobia/assets'), 'PHOBIA');
} else {
    logDetail('Secondary asset path not found. Skipping.');
}
logSuccess('ASSETS', 'Asset synchronization complete.');

// 3. Process and Minify index.html
logHeader('HTML Compilation');

function processHtml() {
    const indexPath = 'index.html';
    const destIndexPath = path.join(distDir, `${npmstuff.title}.html`);

    logStep(5, 'HTML', `Locating template: ${indexPath}`);
    if (!fs.existsSync(indexPath)) {
        logWarning('HTML', 'index.html not found in root directory. Skipping.');
        return;
    }

    let htmlContent = fs.readFileSync(indexPath, 'utf8');
    const originalLength = htmlContent.length;
    logDetail(`Original payload size: ${originalLength.toLocaleString()} bytes`);

    if (isPackage || !isServe) {
        logDetail('Applying production HTML compression rules.');
        htmlContent = htmlContent
            .replace(/<!--[\s\S]*?-->/g, '')
            .replace(/\s{2,}/g, ' ')
            .replace(/\n/g, '')
            .replace(/>\s+</g, '><')
            .trim();

        const saved = originalLength - htmlContent.length;
        const ratio = ((saved / originalLength) * 100).toFixed(2);
        logSuccess('HTML', `Minification complete. Reduced by ${saved.toLocaleString()} bytes (${ratio}% reduction).`);
    } else {
        logDetail('Serve mode active. Skipping aggressive HTML minification.');
    }

    fs.writeFileSync(destIndexPath, htmlContent, 'utf8');
    logSuccess('HTML', `Deployed index.html to ${destIndexPath}`);
}

processHtml();

// 4. Esbuild configuration
logHeader('Bundler Configuration');
logStep(6, 'ESBUILD', 'Setting up compilation parameters.');

const buildOptions = {
    entryPoints: ['src/main.ts'],
    bundle: true,
    outfile: 'dist/bundle.js',
    target: ['es2022'],
    format: 'iife',
    sourcemap: isServe ? 'inline' : false, 
    minify: false, 
    drop: isPackage ? ['console', 'debugger'] : [],
};

logDetail(`Build Options: ${JSON.stringify(buildOptions, null, 2)}`);

(async () => {
    if (isServe) {
        logHeader('Live Development Server');
        logStep(7, 'SERVE', 'Initializing compilation context.');
        let ctx = await esbuild.context(buildOptions);
        
        logStep(8, 'SERVE', 'Starting local server instance.');
        let { host, port } = await ctx.serve({
            servedir: 'dist',
            port: 3000,
        });
        console.log(`\n${c.green}${c.bright}[SERVER READY]${c.reset} Running at http://${host}:${port}\n`);
    } else {
        logHeader('Production Compilation');
        logStep(7, 'BUILD', 'Running esbuild bundle compiler.');
        const startTime = Date.now();
        
        await esbuild.build(buildOptions);
        
        const duration = Date.now() - startTime;
        logSuccess('BUILD', `Bundle compiled successfully in ${duration}ms.`);

        if (isPackage || !isServe) {
            const bundlePath = path.join(distDir, 'bundle.js');
            if (fs.existsSync(bundlePath)) {
                logStep(8, 'OBFUSCATOR', 'Initializing code obfuscation pipeline.');
                let rawCode = fs.readFileSync(bundlePath, 'utf8');
                logDetail(`Raw bundle size: ${(rawCode.length / 1024).toFixed(2)} KB`);

                logDetail('Applying obfuscation transforms (control flow flattening, string arrays, dead code injection)...');
                const obfuscationResult = JavaScriptObfuscator.obfuscate(rawCode, {
                    compact: true,
                    controlFlowFlattening: true,
                    controlFlowFlatteningThreshold: 0.8,
                    numbersToExpressions: true,
                    simplify: true,
                    stringArray: true,
                    stringArrayEncoding: ['base64', 'rc4'],
                    stringArrayThreshold: 0.9,
                    deadCodeInjection: true,
                    deadCodeInjectionThreshold: 0.4,
                    identifierNamesGenerator: 'hexadecimal',
                    renameGlobals: false,
                    rotateStringArray: true,
                    selfDefending: false, 
                    shuffleStringArray: true,
                    splitStrings: true,
                    splitStringsChunkLength: 5,
                    unicodeEscapeSequence: false
                });

                const obfuscatedCode = obfuscationResult.getObfuscatedCode();
                logDetail(`Obfuscated bundle size: ${(obfuscatedCode.length / 1024).toFixed(2)} KB`);

                fs.writeFileSync(bundlePath, obfuscatedCode, 'utf8');
                logSuccess('OBFUSCATOR', 'Bundle obfuscation and hardening complete.');
            } else {
                logWarning('OBFUSCATOR', 'Target bundle file missing. Skipping obfuscation.');
            }
        }

        logSuccess('BUILD', 'Production build pipeline finished.');

        // 6. Packaging into a ZIP file
        if (isPackage) {
            logHeader('Archive Packaging');
            logStep(9, 'PACKAGE', 'Preparing distribution archive.');

            if (!fs.existsSync(releaseDir)) {
                logDetail(`Release directory missing. Creating: ${releaseDir}`);
                fs.mkdirSync(releaseDir, { recursive: true });
            }

            const buildTypeTag = npmstuff.buildtype || 'release';
            const zipFileName = `${npmstuff.name}_${npmstuff.version}_${buildTypeTag}.zip`;
            const zipPath = path.join(releaseDir, zipFileName);
            
            logDetail('Initializing compression engine.');
            const zip = new AdmZip();
            zip.addLocalFolder(distDir);
            
            logDetail(`Writing archive to: ${zipPath}`);
            zip.writeZip(zipPath);

            const stats = fs.statSync(zipPath);
            const sizeMb = (stats.size / (1024 * 1024)).toFixed(2);

            console.log(`\n${c.green}${c.bright}[ARCHIVE CREATED]${c.reset}`);
            console.log(`  File Name : ${zipFileName}`);
            console.log(`  Size      : ${sizeMb} MB`);
            console.log(`  Location  : ${zipPath}\n`);
        }
    }
})().catch((err) => {
    console.error(`\n${c.red}${c.bright}[FATAL ERROR] Build pipeline failed.${c.reset}`);
    console.error(err);
    process.exit(1);
});