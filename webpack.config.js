const path = require('path');
const fs = require('fs');
const libName = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'package.json'))).name

module.exports = {
	entry: './src/index.js',
	output: {
		filename: 'index.js',
		path: path.resolve(__dirname, 'dist'),
		library: libName,
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