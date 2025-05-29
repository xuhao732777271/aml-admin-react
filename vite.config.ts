import type { ConfigEnv, UserConfig } from 'vite';
import { loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import { viteMockServe } from 'vite-plugin-mock';
import { wrapperEnv } from './build/utils';
// 需要安装 @typings/node 插件
import { resolve } from 'path';

/** @type {import('vite').UserConfig} */
export default ({ mode }: ConfigEnv): UserConfig => {
  const root = process.cwd();

  const env = loadEnv(mode, root);

  // this function can be converted to different typings
  const viteEnv: any = wrapperEnv(env);
  const { VITE_PORT, VITE_DROP_CONSOLE } = viteEnv;

  return {
    base: './',
    server: {
      host: true,
      open: true,
      port: VITE_PORT,
      proxy: {
        // 代理 /dev-api 的请求
        [env.VITE_BASE_API]: {
          changeOrigin: true,
          // 代理目标地址
          target: env.VITE_API_URL,
          rewrite: path => path.replace(new RegExp('^' + env.VITE_BASE_API), '')
        }
      }
    },
    plugins: [
      react(),
      createSvgIconsPlugin({
        iconDirs: [resolve(process.cwd(), 'src/assets/icons')],
        symbolId: 'icon-[dir]-[name]'
      }),
      viteMockServe({
        mockPath: 'mock',
        ignore: /^_/,
        localEnabled: true,
        prodEnabled: false,
        injectCode: `
          import { setupProdMockServer } from 'mock/_createProductionServer';

          setupProdMockServer()
          `
      })
    ],

    build: {
      target: 'es2015',
      cssTarget: 'chrome86',
      minify: 'terser',
      terserOptions: {
        compress: {
          keep_infinity: true,
          // used to delete console and debugger in production environment
          drop_console: VITE_DROP_CONSOLE
        }
      },
      chunkSizeWarningLimit: 2000
    },

    resolve: {
      alias: {
        '@': resolve(__dirname, './src')
      }
    }
  };
};
