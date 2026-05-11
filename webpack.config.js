import webpack from 'webpack';

import path from 'node:path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

export default {
	entry: {
		main: './dist/src/index.js',
		ping: './dist/tests/ping.js',
		// pong: './dist/tests/pong.js',

	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].bundle.js',
		//globalObject: 'this',
	},
	
	mode: 'development',
	optimization: {
		minimize: false,
		splitChunks: false,
		runtimeChunk: false,
	},
	devtool: 'source-map',

	resolve: {
		
	},

	externals: {
		'node:.*': 'commonjs node:.*',
	},

	plugins: [
		new webpack.optimize.LimitChunkCountPlugin({
			maxChunks: 1
		}),
	],
};
