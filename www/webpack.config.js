"use strict";

const keys = {
	env: {
		dev: 'development',
		prod: 'production'
	}
};

const NODE_ENV = process.env.NODE_ENV || keys.env.dev;
const webpack = require('webpack');

module.exports = {

	context: __dirname + '/frontend',

	// entry: './home', // simple variant of 'entry: {..<several entry points>..}'
	entry: {
		main: './main'
		// home: './home',
		// about: './about',
		// common: ['./common', './welcome'] // only last module will be exported
	},
	output: {
		path: __dirname + '/public', // relative path is available, bot not recommended
		filename: '[name].js',
		library: '[name]'
	},

	watch: NODE_ENV === keys.env.dev,

	watchOptions: {
		aggregateTimeout: 300
	},

	devtool: NODE_ENV === keys.env.dev ? 'source-map' : null,

	plugins: [
		new webpack.NoErrorsPlugin(),
		new webpack.DefinePlugin({
			NODE_ENV: JSON.stringify(NODE_ENV)
		})
	],

	resolve: {
		modulesDirectories: ['node_modules'],
		extensions: ['', '.js']
	},

	resolveLoader: {
		modulesDirectories: ['node_modules'],
		// moduleTemplates: ['*-loader', '*'],
		extensions: ['', '.js']
	},

	module: {
		loaders: [{
			test: /\.js$/,
			exclude: /(node_modules|bower_components)/,
			loader: 'babel',
			query: {
				presets: ['es2015'],
				plugins: ['transform-runtime']
			}
		}]
	}

};

if (NODE_ENV === keys.env.prod) {
	module.exports.plugins.push(
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				// warning: true,
				drop_console: true,
				unsafe: true
			}
		})
	);
}



