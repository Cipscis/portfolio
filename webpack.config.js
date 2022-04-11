import dotenv from 'dotenv';
dotenv.config();

import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = fileURLToPath(import.meta.url);

import resolveTypeScriptPluginModule from 'resolve-typescript-plugin';
const ResolveTypeScriptPlugin = resolveTypeScriptPluginModule.default;

const entryPath = './app/assets/js/src';
const distPath = path.resolve(__dirname, '../app/assets/js/dist');

const config = {
	mode: process.env.MODE,
	entry: {
		main: `${entryPath}/main.ts`,

		animations: `${entryPath}/animations/example.js`,
		autocomplete: `${entryPath}/autocomplete/example.js`,
		assist: `${entryPath}/assist/example.js`,
		contrast: `${entryPath}/contrast/contrast.ts`,
		dragsort: `${entryPath}/dragsort/dragsort.js`,
		expander: `${entryPath}/expander/expander.js`,
		modal: `${entryPath}/modal/example.js`,
		status: `${entryPath}/status/example.js`,
		tooltip: `${entryPath}/tooltip/tooltip.js`,
		validate: `${entryPath}/validate/example.js`,
	},
	output: {
		path: distPath,
		filename: '[name].js',
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
