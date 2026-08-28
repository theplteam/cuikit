import fs from 'fs';
import path from 'path';
import type { Plugin } from 'vite';

const ENDPOINT = '/__smooth-rec';
const OUT_DIR = 'src/views/sandbox/temp';

const sanitize = (name: string) => name.replace(/[^a-zA-Z0-9._-]/g, '-').slice(0, 120);

const readBody = (req: NodeJS.ReadableStream) => new Promise<string>((resolve, reject) => {
  const chunks: Buffer[] = [];

  req.on('data', (chunk: Buffer) => chunks.push(chunk));
  req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
  req.on('error', reject);
});

/**
 * Dev-only endpoint that lets the sandbox write a smooth-animation recording straight into
 * the repo, so a dump can be inspected with the normal file tooling instead of being fished
 * out of the browser's download folder. Never part of a production build (`apply: 'serve'`).
 *
 * POST /__smooth-rec  { fileName?: string, ...recording }  ->  { path, bytes }
 */
export const smoothRecorderPlugin = (): Plugin => ({
  name: 'smooth-recorder-sink',
  apply: 'serve',
  configureServer(server) {
    server.middlewares.use(ENDPOINT, async (req, res) => {
      if (req.method !== 'POST') {
        res.statusCode = 405;
        res.end('POST only');
        return;
      }

      try {
        const raw = await readBody(req);
        const payload = JSON.parse(raw);
        const outDir = path.resolve(server.config.root, OUT_DIR);

        fs.mkdirSync(outDir, { recursive: true });

        const fileName = sanitize(payload.fileName || `smooth-${Date.now()}.json`);
        const filePath = path.join(outDir, fileName);

        delete payload.fileName;
        fs.writeFileSync(filePath, JSON.stringify(payload, null, 2), 'utf8');

        const relative = path.join(OUT_DIR, fileName).replace(/\\/g, '/');

        server.config.logger.info(`[smooth-rec] saved ${relative} (${raw.length} bytes)`);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ path: relative, bytes: raw.length }));
      } catch (error) {
        server.config.logger.error(`[smooth-rec] ${String(error)}`);
        res.statusCode = 500;
        res.end(JSON.stringify({ error: String(error) }));
      }
    });
  },
});

export default smoothRecorderPlugin;
