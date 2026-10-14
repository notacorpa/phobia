import * as esbuild from 'esbuild';
import fs from 'fs';
import path from 'path';
import AdmZip from 'adm-zip';
import JavaScriptObfuscator from 'javascript-obfuscator';

const args = process.argv.slice(2);
const isServe = args.includes('--serve');
const isPackage = args.includes('--package');

const distDir = path.resolve('dist');
const releaseDir = path.resolve('release');
const assetsDir = path.resolve('assets');
const distAssetsDir = path.join(distDir, 'assets');

// 1. Clean and recreate dist folder
if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

// 2. Copy assets folder recursively
function copyRecursiveSync(src, dest) {
    if (!fs.existsSync(src)) return;
    fs.mkdirSync(dest, { recursive: true });
    let entries = fs.readdirSync(src, { withFileTypes: true });

    for (let entry of entries) {
        let srcPath = path.join(src, entry.name);
        let destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyRecursiveSync(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

copyRecursiveSync(assetsDir, distAssetsDir);
if (fs.existsSync('./.phobia/assets')) {
    copyRecursiveSync('./.phobia/assets', 'dist/phobia/assets');
}
console.log('📁 Assets copied successfully to dist/assets/ 🚀✨');

// 3. Process and Minify index.html (Extreme Compression for Production)
function processHtml() {
    const indexPath = 'index.html';
    const destIndexPath = path.join(distDir, 'index.html');

    if (!fs.existsSync(indexPath)) {
        console.warn('⚠️ Warning: index.html not found in root directory!');
        return;
    }

    let htmlContent = fs.readFileSync(indexPath, 'utf8');

    if (isPackage || !isServe) {
        // Hardcore HTML minification: strip comments, collapse whitespace & newlines
        htmlContent = htmlContent
            .replace(/<!--[\s\S]*?-->/g, '') // Remove HTML comments
            .replace(/\s{2,}/g, ' ')         // Collapse multiple spaces into one
            .replace(/\n/g, '')              // Remove all newlines
            .replace(/>\s+</g, '><')         // Remove whitespace between HTML tags
            .trim();
        console.log('🔒 index.html heavily obfuscated and minified!');
    }

    fs.writeFileSync(destIndexPath, htmlContent, 'utf8');
    console.log('📄 index.html deployed to dist/');
}

processHtml();

// 4. Esbuild configuration for initial bundling
const buildOptions = {
    entryPoints: ['src/main.ts'],
    bundle: true,
    outfile: 'dist/bundle.js',
    target: ['es2022'],
    format: 'iife',
    // Disable sourcemaps in production packaging so people can't read your original source tree!
    sourcemap: isServe ? 'inline' : false, 
    // Keep esbuild minification light or disabled if javascript-obfuscator is handling the heavy lifting, 
    // but enabling basic minification helps pre-compress before obfuscation.
    minify: false, 
    drop: isPackage ? ['console', 'debugger'] : [],
};

if (isServe) {
    let ctx = await esbuild.context(buildOptions);
    let { host, port } = await ctx.serve({
        servedir: 'dist',
        port: 3000,
    });
    console.log(`🚀 Engine live development server running at http://${host}:${port} 💻🔥`);
} else {
    // Build the bundle using esbuild first
    await esbuild.build(buildOptions);
    console.log('📦 Esbuild bundle generated successfully.');

    // 5. Hardcore JavaScript Obfuscation Pass (Only for production/packaging)
    if (isPackage || !isServe) {
        const bundlePath = path.join(distDir, 'bundle.js');
        if (fs.existsSync(bundlePath)) {
            console.log('🛡️ Initiating hardcore cryptographic JavaScript obfuscation... 💀⚡');
            
            const rawCode = fs.readFileSync(bundlePath, 'utf8');
            
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
                selfDefending: false, // Keep false for local file builds to avoid breaking file:// protocol execution!
                shuffleStringArray: true,
                splitStrings: true,
                splitStringsChunkLength: 5,
                unicodeEscapeSequence: false
            });

            fs.writeFileSync(bundlePath, obfuscationResult.getObfuscatedCode(), 'utf8');
            console.log('🔒 bundle.js successfully transformed into an impenetrable fortress of code! 🏰✨');
        }
    }

    console.log('🎉 Build complete! Hardcore obfuscated bundle and assets are locked down in /dist. 🛡️💀');

    // 6. Package into a ZIP file using AdmZip if --package flag is passed
    if (isPackage) {
        if (!fs.existsSync(releaseDir)) {
            fs.mkdirSync(releaseDir, { recursive: true });
        }

        const zipPath = path.join(releaseDir, 'game-build.zip');
        
        // Initialize AdmZip and add the entire dist directory contents
        const zip = new AdmZip();
        zip.addLocalFolder(distDir);
        zip.writeZip(zipPath);

        console.log(`📦 Successfully packaged and secured! Archive created at: release/game-build.zip 🚀✨🖤`);
    }
}