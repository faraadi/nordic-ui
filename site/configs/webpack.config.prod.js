const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const DuplicatePackageCheckerPlugin = require("duplicate-package-checker-webpack-plugin");
const path = require('path');

const rootPath = path.resolve(__dirname, "../");
const distPath = path.resolve(rootPath, "dist");
const publicPath = path.resolve(rootPath, "public");
const srcPath = path.resolve(rootPath, "src");

module.exports = {
	mode: "production",
	entry: {
		main: path.resolve(srcPath, "index.js"),
		docs: path.resolve(srcPath, "docs/index.js"),
		faq: path.resolve(srcPath, "faq/index.js"),
		commons: path.resolve(srcPath, "commons/index.js")
	},
	resolve: {
		alias: {
			commons: path.resolve(srcPath, "commons"),
			assets: path.resolve(srcPath, "assets"),
			modules: path.resolve(srcPath, "modules")
		}
	},
	output: {
		path: path.resolve(distPath),
		filename: chunkData => {
			switch (chunkData.chunk.name) {
				default:
				case "commons": 
				case "main": return '[name].[contenthash].js'
				case "docs": return 'docs/[name].[contenthash].js'
				case "faq": return 'faq/[name].[contenthash].js'
			}
		},
		chunkFilename: '[name].[id].[ext]'
	},
	module: {
		rules: [
		{
			test: /\.(png|svg|jpg|gif|woff|woff2|eot|ttf|otf|md|script.js)$/,
			loader: 'file-loader',
			options: {
				esModule: false,
				name(fileName) {
					if (fileName.match(/\.(png|svg|jpg|jpeg|gif)$/)) {
						return "images/[name].[hash].[ext]";
					}
					else if (fileName.match(/\.(woff|woff2|eot|ttf|otf)$/)) {
						return "fonts/[name].[hash].[ext]";
					}
					else if(fileName.match(/\.(md)$/)) {
						return 'docs/[name].[ext]';
					}
					else if(fileName.match(/\.(script.js)$/)) {
						return 'scripts/[name].[ext]';
					}
					return '[path][name].[ext]';
				},
			},
		},
		{
			test: /\.css$/,
			use: [MiniCssExtractPlugin.loader, 'css-loader']
		},
		]
	},
	plugins: [
		new CleanWebpackPlugin(),
		new MiniCssExtractPlugin({
			filename: chunkData => {
				switch (chunkData.chunk.name) {
					default:
					case "commons": 
					case "main": return '[name].[hash].css'
					case "docs": return 'docs/[name].[hash].css'
					case "faq": return 'faq/[name].[hash].css'
				}
			},
			chunkFilename: '[id].[hash].css',
		}),
		new HtmlWebpackPlugin({
			template: path.resolve(rootPath, 'src', "index.html"),
			chunks: ["main", "commons"],
			templateParameters: {
				'PUBLIC_URL': process.env.PUBLIC_URL || "/"
			}
		}),
		new HtmlWebpackPlugin({
			template: path.resolve(rootPath, 'src', "docs/index.html"),
			chunks: ["docs", "commons"],
			templateParameters: {
				'PUBLIC_URL': process.env.PUBLIC_URL || "/docs"
			},
			filename: "docs/index.html"
		}),
		new HtmlWebpackPlugin({
			template: path.resolve(rootPath, 'src', "faq/index.html"),
			chunks: ["faq", "commons"],
			templateParameters: {
				'PUBLIC_URL': process.env.PUBLIC_URL || "/faq"
			},
			filename: "faq/index.html"
		}),
		new DuplicatePackageCheckerPlugin(),
		new CopyPlugin([
		{
			from: publicPath, to: distPath
		}
		]),
	],
	devtool: false
}