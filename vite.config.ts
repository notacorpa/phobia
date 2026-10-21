import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
  plugins: [
    viteSingleFile({
      useRecommendedBuildConfig: true
    }),
  ],
  build: {
    target: 'esnext',
    assetsInlineLimit: 100000000, // 100MB asset inline limit (forces textures/GLTFs into Base64 Data URIs)
    cssCodeSplit: false,
    minify: 'terser', // Maximize compression into single file
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
  },
});