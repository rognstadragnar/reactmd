const path = require("path")
const webpack = require("webpack")

const Marked = require('marked')
const renderer = new Marked.Renderer()
renderer.heading = (text, level) => '<h' + level + '>' + text + '</' + 'h' + level + '>'

module.exports = {
	entry: [
		'webpack-dev-server/client?http://localhost:1337',
		'webpack/hot/dev-server',
		path.join(__dirname, "/src/index.jsx")
	],
	output: {
		path: path.join(__dirname, "/dist/"),
		filename: "bundle.js",
	},
	module: {
		preLoaders: [
			{test: /\.jsx?$/, loader: "eslint-loader", exclude: /node_modules/}
		],
		loaders: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				loader: ["babel"],
				include: path.join(__dirname, "/src"),
				query: {
						presets: [ 'es2015', 'react', 'react-hmre' ]
				}
			},
			{test: /\.md$/, loader: 'html!markdown'}
		]
	},
	markdownLoader: {
		renderer: renderer,
		gfm: true,
		tables: true,
		breaks: false,
		pedantic: false,
		sanitize: true,
		smartLists: true,
		smartypants: false,
		highlight(code) {
			return require('highlightjs').highlightAuto(code).value
		}
	},
	eslint: {
		configFile: './.eslintrc.json'  //your .eslintrc file
	},
	resolve: {
		extensions: ['', '.js', '.jsx', '.md']
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin()
	],
	devServer: {
		hot: true,
		contentBase: './dist',
		port: 1337
	}
}
