const path = require('path') // resolve path
const HtmlWebpackPlugin = require('html-webpack-plugin') // create file.html
const { CleanWebpackPlugin } = require('clean-webpack-plugin') // clean the folder each build
const MiniCssExtractPlugin = require('mini-css-extract-plugin') // extract css to files
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin') // minify css
const TerserPlugin = require('terser-webpack-plugin') // minify js
// const tailwindcss = require('tailwindcss')
// const autoprefixer = require('autoprefixer') // help tailwindcss to work
const ImageminPlugin = require('imagemin-webpack-plugin').default
const imageminMozjpeg = require('imagemin-mozjpeg')

module.exports = {
	mode: 'development',
	devtool: 'eval-cheap-source-map',
	devServer: { contentBase: path.join(__dirname, 'prod'), port: 3000, hot: true },

	resolve: {
		extensions: ['.js', '.jsx'] // we can import without typing '.js or .jsx'
	},
	entry: {
		index: path.join(__dirname, 'src/index.jsx')
	},

	output: {
		path: path.resolve(__dirname, './prod'),
		filename: '[name].[hash].bundle.js' // for production use [contenthash], for developement use [hash]
	},
	plugins: [
		new MiniCssExtractPlugin({ filename: '[name].[contenthash].css', chunkFilename: '[id].[contenthash].css' }),
		// new CleanWebpackPlugin(),
		new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }), // tell webpack that we dont want to remove index.html after each update
		new HtmlWebpackPlugin({
			template: path.join(__dirname, 'index.html')
		}),
		new ImageminPlugin({
			// minimize images
			pngquant: { quality: [0.5, 0.5] },
			plugins: [imageminMozjpeg({ quality: 50 })]
		})
	],

	optimization: {
		minimizer: [new TerserPlugin(), new OptimizeCssAssetsPlugin({})],

		moduleIds: 'deterministic',
		runtimeChunk: 'single',
		splitChunks: {
			cacheGroups: {
				vendor: {
					test: /[\\/]node_modules[\\/]/,
					name: 'vendors',
					chunks: 'all'
				}
			}
		}
	},

	module: {
		rules: [
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader'],
			  },
			{
				test: /\.(png|svg|jpg|gif)$/i,
				use: ['file-loader']
			},
			{
				test: /\.html$/,
				use: [{ loader: 'html-loader' }]
			},
			{
				test: /\.(js|jsx)$/,
				exclude: /(node_modules|bower_components|prod)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env', '@babel/preset-react']
					}
				}
			},
			{
				loader: "webpack-preprocessor-loader",
				options: {
				  debug: process.env.NODE_ENV !== "product",
				  directives: {
					secret: false,
				  },
				  params: {
					ENV: process.env.NODE_ENV,
					LANG : "en"
				  },
				  verbose: false,
				},
			  }
		]
	}
}
