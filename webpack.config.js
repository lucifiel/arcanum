const path = require('path');
const fs = require('fs');

const VueLoader = require('vue-loader/lib/plugin');
//const WorkboxPlugin = require( 'workbox-webpack-plugin');
const CopyPlugin = require( 'copy-webpack-plugin');
const HtmlWebpackPlugin = require( 'html-webpack-plugin');

const ZipPlugin = require('zip-webpack-plugin');

const webpack = require('webpack');

const UiDir = path.resolve( __dirname, 'src/ui');
const DebugDir = path.resolve( __dirname, 'src/debug');

let packData = fs.readFileSync( 'package.json');
packData = JSON.parse( packData);
packData.version = "pseudo_stable " + packData.version;
const VERS_STR = JSON.stringify( packData.version );

const MakePlugins = ( env, buildPath ) => {

	const plugins = [
		new VueLoader({
			compilerOptions:{

				whitespace:'condense'
			}
		}),
		new webpack.DefinePlugin({
			__DEBUG:true,
			__CHEATS:true,
			__KONG:env.kong || false,
			__DIST:env.production ? true : false,
			__CLOUD:!env.kong && env.cloud,
			__VERSION:VERS_STR
		}),
		new HtmlWebpackPlugin({

			template:'index.ejs',
			title:"Theory of Magic",
			filename:path.resolve( buildPath, 'index.html'),
			__KONG:env.kong||false,
			__DIST:env.production ? true : false,
			__CLOUD:env.cloud

		}),
		new CopyPlugin({patterns: [

			{
				from:'data',
				to:path.resolve( buildPath, 'data')
			},
			{
				from:'css',
				to:path.resolve( buildPath, 'css' )
			}
		]}),
		new webpack.ProvidePlugin({
			jQuery: 'jquery',
			$: 'jquery',
			'window.jQuery': 'jquery',
	  	})
	];

	if ( env.kong) {

		plugins.push( new ZipPlugin({

			filename:'kong.zip',
			pathPrefix:'js',
			path:buildPath,
			exclude:/\.html$/

		}));
	}

	return plugins;
}

module.exports = (env, argv) => {

	const BuildPath = path.resolve( __dirname, env['buildpath'] || 'dev' );
	const __DIST = env.production ? true : false;

	return {

	mode: __DIST ? "production" : 'development',
	devtool: 'source-map',
	entry: {
		wizrobe: "./src/index.js",
		script: "./arcanum-script/ArcanumEnhancements.user.js",
	},
	module: {

		rules: [
			{
				test: /\.vue$/,
				include:[ UiDir, DebugDir ],
				loader: 'vue-loader'
			},
			{
				test: /\.css$/i,
				include:[ path.resolve(__dirname, 'css'),
					UiDir,
					DebugDir ],
				use: ['style-loader', 'css-loader']
			},
			{
				test:/\.tsx?$/,
				use:"ts-loader",
				exclude:"/node_modules/"
			}
		],
	},
	plugins: MakePlugins(env, BuildPath ),

	output: {

		filename: "[name].js",
		chunkFilename: "[name].bundle.js",
		path:path.resolve( BuildPath, 'js/' ),
		publicPath:'js/',
		library: "[name]"
	},
	resolve: {
		modules: [
			path.resolve(__dirname, "src"),
			"node_modules"
		],

		extensions:[ '.js', '.ts', '.tsx'],
		alias: {
			'modules':'modules',
			'config': 'config',
			"data": "../data",
			'ui': 'ui',
			'remote':'remote'
		}
	}
}}
