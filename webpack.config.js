import dotenv from 'dotenv';
dotenv.config();

import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = fileURLToPath(import.meta.url);

let config = {
	mode: process.env.MODE,
	entry: {
		autocomplete: './app/assets/js/src/autocomplete.js',
		assist: './app/assets/js/src/assist.js',
		dragsort: './app/assets/js/src/dragsort.js',
		expander: './app/assets/js/src/expander.js',
		keybinding: './app/assets/js/src/keybinding.js',
		modal: './app/assets/js/src/modal.js',
		status: './app/assets/js/src/status.js',
		tooltip: './app/assets/js/src/tooltip.js',
	},
	output: {
		path: path.resolve(__dirname, '../app/assets/js/dist'),
		filename: '[name].bundle.js',
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
