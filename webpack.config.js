import dotenv from 'dotenv';
dotenv.config();

import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = fileURLToPath(import.meta.url);

import resolveTypeScriptPluginModule from 'resolve-typescript-plugin';
const ResolveTypeScriptPlugin = resolveTypeScriptPluginModule.default;

const srcPath = path.resolve(__dirname, '../src');
const entryPath = './app/assets/js/src';
const distPath = path.resolve(__dirname, '../app/assets/js/dist');

const config = {
	mode: process.env.MODE,
	entry: {
		main: './app/assets/js/src/main.ts',

		animations: './app/assets/js/src/animations/example.js',
		autocomplete: './app/assets/js/src/autocomplete/example.js',
		assist: './app/assets/js/src/assist/example.js',
		contrast: './app/assets/js/src/contrast/contrast.ts',
		dragsort: './app/assets/js/src/dragsort/dragsort.js',
		expander: './app/assets/js/src/expander/expander.js',
		modal: './app/assets/js/src/modal/example.js',
		status: './app/assets/js/src/status/example.js',
		tooltip: './app/assets/js/src/tooltip/tooltip.js',
		validate: './app/assets/js/src/validate/example.js',
	},
	output: {
		path: distPath,
		filename: '[name].bundle.js',
	},
	resolve: {
		fullySpecified: true,
		plugins: [new ResolveTypeScriptPlugin()],
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				loader: 'ts-loader',
			},
		],
	},
};

switch (process.env.MODE) {
	case 'development':
		config.optimization = {
			minimize: false,
		};
		config.devtool = 'eval-source-map';
		break;
	case 'production':
	default:
		config.devtool = 'source-map';
		break;
}

export default config;
