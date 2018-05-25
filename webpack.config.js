const path = require('path');

module.exports = {
	entry: './src/index.js',
	output: {
		filename: 'index.js',
		path: path.resolve(__dirname, 'dist'),
		library: 'sd-vue-session',
		libraryTarget: 'umd'
	},
	module: {
		rules: [{
			test: /\.js$/,
			exclude: /node_modules/,
			loader: "babel-loader"
		}, {
			test: /\.vue$/,
			loader: 'vue-loader'
		}]
	}
};