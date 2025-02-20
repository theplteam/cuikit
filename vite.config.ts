import { BuildEnvironmentOptions, defineConfig, loadEnv } from 'vite'
import path from 'path';
import react from '@vitejs/plugin-react'
import checker from 'vite-plugin-checker';
import md5 from 'md5';


// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  const buildVariant = env.BUILD_VARIANT || undefined;
  let buildOptions: BuildEnvironmentOptions | undefined = undefined;
  if (buildVariant) {
    buildOptions = {
      outDir: 'docs',
      rollupOptions: {
        input: path.resolve(__dirname, 'index-doc.html'),
        output: {
          chunkFileNames: (chunkInfo) => {
            const nameNew = md5(chunkInfo.name);
            return `assets/${nameNew}-[hash].js`;
          },
        }
      }
    };
  }
// Фикс ошибки в MUI Popper https://stackoverflow.com/questions/72097831/popper-styled-default-is-not-a-function-mui-5-6-0-material-ui
  return {
    base: "",
    plugins: [
      react({
        jsxImportSource: '@emotion/react',
        babel: {
          plugins: ['@emotion/babel-plugin'],
        },
      }),
      checker({
        typescript: true,
      }),
    ],
    optimizeDeps: {
      include: [
        '@emotion/react', 
        '@emotion/styled', 
        '@mui/material/Tooltip'
      ],
    },
    resolve: {
      alias: {
        '@plteam/chat-ui': path.resolve(__dirname, './packages/chat-ui/src'),
      }
    },
    build: buildOptions,
  }
});
