import { build } from './build.mjs';

// Run build first, then start server serving from dist
await build();

const proc = Bun.spawn({
  cmd: ['bun', 'server.js', '--root', 'dist'],
  stdout: 'inherit',
  stderr: 'inherit',
  stdin: 'inherit',
});

const code = await proc.exited;
process.exit(code ?? 0);

