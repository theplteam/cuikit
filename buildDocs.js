// build-all.js
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

(function () {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const renameIndexFile = () => {
    const docsDir = path.resolve(__dirname, `docs`);
    const oldPath = path.join(docsDir, 'index-doc.html');
    const newPath = path.join(docsDir, 'index.html');


    fs.rename(oldPath, newPath, (err) => {
      if (err) {
        console.error(`File rename error: ${oldPath} => ${newPath}`, err);
        process.exit(1);
      }
    });
  }

  const buildDocs = () => {
    console.log(`Building docs...`);

    console.timeLog('docs');

    execSync('tsc -b && vite build', {
      stdio: 'inherit',
      env: { ...process.env, BUILD_VARIANT: 'docs' }
    });

    renameIndexFile();
  }

  console.time('docs');
  buildDocs();
  console.timeEnd('docs');
})();
