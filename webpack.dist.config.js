const path = require('path');
const VueLoader = require('vue-loader/lib/plugin');
const webpack = require('webpack');

module.exports = {

	mode: "production",
	entry: {
		wizrobe: "./src/index.js"
	},
	module: {

		rules: [
			{
				test: /\.vue$/,
				loader: 'vue-loader'
			},
			{
				test: /\.css$/i,
				use: ['style-loader', 'css-loader']
			}
		],
	},
	plugins: [new VueLoader(),
	new webpack.DefinePlugin({
		__DIST:true,
		__VERSION:1
	})],

	//devtool: 'source-map',

	output: {

		path: path.resolve(__dirname, "dist"),
		publicPath: "dist/",
		filename: "[name].dist.bundle.js",
		chunkFilename: "dist/[name].bundle.js",
		library: "[name]"
	},
	resolve: {
		modules: [
			path.resolve(__dirname, "src"),
			"node_modules"
		],

		alias: {
			'config': 'config',
			"data": "../data",
			'ui': 'ui'
		}
	}

};