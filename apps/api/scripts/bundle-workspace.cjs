/**
 * In pnpm monorepos, workspace dependencies are symlinks pointing outside the project.
 * When deploying apps/api to Vercel (or packaging Lambda functions), external symlinks
 * break inside the serverless container (/var/task).
 *
 * This script unlinks the workspace symlink and copies the actual built distribution files
 * into apps/api/node_modules/@fst/validation as a real directory, ensuring Node can
 * require('@fst/validation') seamlessly at runtime.
 */

const fs = require('node:fs');
const path = require('node:path');

const apiDir = path.resolve(__dirname, '..');
const validationPkgDir = path.resolve(apiDir, '../../packages/validation');
const targetDir = path.resolve(apiDir, 'node_modules/@fst/validation');

function bundleWorkspace() {
  console.log('[bundle-workspace] Packaging @fst/validation into apps/api/node_modules/@fst/validation...');

  if (!fs.existsSync(validationPkgDir)) {
    console.error(`[bundle-workspace] Source validation package not found at: ${validationPkgDir}`);
    process.exit(1);
  }

  const validationDist = path.join(validationPkgDir, 'dist');
  if (!fs.existsSync(validationDist)) {
    console.error(`[bundle-workspace] Validation package dist/ not found. Did you build it first?`);
    process.exit(1);
  }

  // Remove existing symlink or folder if present
  if (fs.existsSync(targetDir)) {
    try {
      const stat = fs.lstatSync(targetDir);
      if (stat.isSymbolicLink()) {
        fs.unlinkSync(targetDir);
      } else {
        fs.rmSync(targetDir, { recursive: true, force: true });
      }
    } catch (err) {
      console.warn(`[bundle-workspace] Warning removing target: ${err.message}`);
    }
  }

  // Ensure parent directory exists
  fs.mkdirSync(path.dirname(targetDir), { recursive: true });

  // Create target directory
  fs.mkdirSync(targetDir, { recursive: true });

  // Copy package.json
  fs.copyFileSync(
    path.join(validationPkgDir, 'package.json'),
    path.join(targetDir, 'package.json')
  );

  // Copy dist folder
  fs.cpSync(validationDist, path.join(targetDir, 'dist'), { recursive: true });

  // Copy src folder so TypeScript can resolve types declared in package.json
  const validationSrc = path.join(validationPkgDir, 'src');
  if (fs.existsSync(validationSrc)) {
    fs.cpSync(validationSrc, path.join(targetDir, 'src'), { recursive: true });
  }

  console.log('[bundle-workspace] Successfully replaced symlink with physical package copy in apps/api/node_modules/@fst/validation.');
}

bundleWorkspace();
