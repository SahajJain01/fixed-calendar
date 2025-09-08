// Build script using Bun.build and Node's fs for copies
import { rm, mkdir, stat, readdir, copyFile } from 'fs/promises';
import { constants as fsConstants } from 'fs';
import path from 'path';

const root = path.resolve(import.meta.dir, '..');
const dist = path.join(root, 'dist');

async function exists(p) {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

async function emptyDir(dir) {
  if (await exists(dir)) {
    await rm(dir, { recursive: true, force: true });
  }
  await mkdir(dir, { recursive: true });
}

async function copyDir(src, dest) {
  await mkdir(dest, { recursive: true });
  const entries = await readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDir(s, d);
    } else if (entry.isFile()) {
      await copyFile(s, d, fsConstants.COPYFILE_FICLONE_FORCE ?? 0);
    }
  }
}

export async function build() {
  // Clean dist
  await emptyDir(dist);

  // Bundle and minify app.js to dist/app.js
  const result = await Bun.build({
    entrypoints: [path.join(root, 'app.js')],
    outdir: dist,
    target: 'browser',
    minify: true,
    sourcemap: 'none',
    splitting: false,
  });

  if (!result.success) {
    const messages = result.logs?.map(l => l.message).join('\n') || 'Unknown error';
    throw new Error(`Build failed.\n${messages}`);
  }

  // Copy index.html and assets
  await copyFile(path.join(root, 'index.html'), path.join(dist, 'index.html'));
  const assetsSrc = path.join(root, 'assets');
  if (await exists(assetsSrc)) {
    await copyDir(assetsSrc, path.join(dist, 'assets'));
  }

  console.log('Build complete →', dist);
}

// If run directly
if (import.meta.main) {
  build().catch((err) => {
    console.error(err);
    process.exitCode = 1;
  });
}

