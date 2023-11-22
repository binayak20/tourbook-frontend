import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-plugin-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
	optimizeDeps: {
		include: ['antd', 'lodash'],
	},
	// css: {
	// 	preprocessorOptions: {
	// 		less: {
	// 			javascriptEnabled: true,
	// 		},
	// 	},
	// },

	...(process.env.WIDGET
		? {
				publicDir: resolve(__dirname, './public/widget'),
				define: {
					'process.env.NODE_ENV': process.env.MODE,
				},
				css: {
					preprocessorOptions: {
						less: {
							javascriptEnabled: true,
						},
					},
				},
		  }
		: {}),

	build: {
		...(process.env.WIDGET
			? {
					outDir: resolve(__dirname, './dist/widget'),
					minify: true,
					lib: {
						entry: resolve(__dirname, './src/widget/main.tsx'),
						name: 'widget',
						fileName: (format) => `script.${format}.js`,
						formats: ['iife'],
					},
			  }
			: {}),
		sourcemap: false,
	},
	plugins: [react(), tsconfigPaths(), svgr()],
});
