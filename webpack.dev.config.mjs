const path = require( 'path' );
const VueLoader = require('vue-loader/lib/plugin');

module.exports = {

	mode:"development",
	entry:{
		wizrobe:"./src/index.js"
	},
	module:{

			rules:[
				{
					test:/\.vue$/,
					loader:'vue-loader'
				},
				{
					test:/\.css$/i,
					use:[ 'style-loader', 'css-loader']
				}
			],
	},
	plugins:[new VueLoader()],
	output:{

		path:path.resolve( __dirname, "dist"),
		publicPath:"dist/",
		filename:"[name].dev.bundle.js",
		chunkFilename:"dev/[name].bundle.js",
		library:"[name]"
	},
	resolve:{
		modules:[
			path.resolve( __dirname, "src"),
			"node_modules"
		],

		alias:{
			'config':'config_dev',
			'data':'../data',
			'ui':'ui'
		}
	}

};