import { fileURLToPath } from 'url';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import path from 'path';
import { default as rollUpUrl } from '@rollup/plugin-url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    define: {
      'import.meta.env.VITE_API_KEY': JSON.stringify(env.VITE_API_KEY),
    },
    plugins: [
      react(),
      svgr(),
      rollUpUrl({
        include: ['**/*.woff2', '**/*.woff', '**/*.ttf', '**/*.eot', '**/*.svg'],
        limit: Infinity,
        publicPath: '/',
      }),
      
    ],
    base: '/WeatherApp/',
    build: {
      outDir: 'dist',
    },
    css: {
      // additionalData: `@import "${path.resolve(__dirname, 'src/styles/_mixins.scss')}";`  ,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  };
});