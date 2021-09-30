const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: [
		'./index.js',
		'./index.css'
	],
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].bundle.js'
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader']
			},
			{
				test: /\.ttf$/,
				use: ['file-loader']
			},    
			{
      			test: /\.m?js$/,
      			exclude: /(node_modules)/,
      			use: {
        			loader: 'babel-loader',
        			options: {
						presets: [["@babel/preset-react", {
							'runtime': 'automatic'
						}]]
					}
      			}
    		}
		]
	},
	plugins: [
		new CopyPlugin({
			patterns: [
				{ from: './index.html', to: '' },
				{ from: './images/basbolt.img', to: '' },
				{ from: './images/seabios.bin', to: '' },
				{ from: './images/vgabios.bin', to: '' },
				{ from: './v86/libv86.js', to: '' },
				{ from: './v86/v86.wasm', to: 'build' }
			]
		}),
		new HtmlWebpackPlugin({
			template: './index.html'
		})
	],
	externals: {
	  'react': 'React',
	  'react-dom': 'ReactDOM',
	  'prop-types': 'PropTypes'
	}
};