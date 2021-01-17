const common = require('webpack.config.common');
 const { merge } = require('webpack-merge');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const TerserPlugin = require("terser-webpack-plugin"); 
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = merge(common, {
	mode: 'production',
	plugins: [
		new MiniCssExtractPlugin({
			filename: '[name].css',
			chunkFilename: '[id].css',
		}),
		new BundleAnalyzerPlugin()
	],
	optimization: {
		splitChunks: {
			chunks: 'all'
		},
		minimize: true,
		minimizer: [
			new TerserPlugin(),
			new CssMinimizerPlugin(),
		],
  	},
});