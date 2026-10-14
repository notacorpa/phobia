import * as esbuild from 'esbuild';
import fs from 'fs';
import path from 'path';
import AdmZip from 'adm-zip';

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
console.log('📁 Assets copied successfully to dist/assets/');

// 3. Copy index.html to dist
if (fs.existsSync('index.html')) {
    fs.copyFileSync('index.html', path.join(distDir, 'index.html'));
    console.log('📄 index.html copied to dist/');
} else {
    console.warn('⚠️ Warning: index.html not found in root directory!');
}

// 4. Esbuild configuration for bundling everything into a SINGLE FILE
const buildOptions = {
    entryPoints: ['src/main.ts'],
    bundle: true,
    outfile: 'dist/bundle.js',
    target: ['es2022'],
    format: 'iife',
    sourcemap: true,
    minify: isPackage, // Minifies bundle code automatically during packaging!
};

if (isServe) {
    let ctx = await esbuild.context(buildOptions);
    let { host, port } = await ctx.serve({
        servedir: 'dist',
        port: 3000,
    });
    console.log(`🚀 Engine live development server running at http://${host}:${port}`);
} else {
    await esbuild.build(buildOptions);
    console.log('🎉 Build complete! Single-file bundle and assets are ready in /dist.');

    // 5. Package into a ZIP file using AdmZip if --package flag is passed
    if (isPackage) {
        if (!fs.existsSync(releaseDir)) {
            fs.mkdirSync(releaseDir, { recursive: true });
        }

        const zipPath = path.join(releaseDir, 'game-build.zip');
        
        // Initialize AdmZip and add the entire dist directory contents
        const zip = new AdmZip();
        zip.addLocalFolder(distDir);
        zip.writeZip(zipPath);

        console.log(`📦 Successfully packaged! Archive created at: release/game-build.zip 🚀🔥`);
    }
}