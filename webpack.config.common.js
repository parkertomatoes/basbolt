const path = require('path');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
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
		new MonacoWebpackPlugin({ languages: ['vb'], features: [
			"!codelens",
			"!quickCommand",
			"!quickOutline",
			"!referenceSearch",
			"!contextmenu",
			"!inspectTokens",
			"!snippets",

			/*
			"!accessibilityHelp",
			"!bracketMatching",
			"!caretOperations",
			"!clipboard",
			"!codeAction",
			"!colorDetector",
			"!comment",
			"!cursorUndo",
			"!dnd",
			"!folding",
			"!fontZoom",
			"!format",
			"!gotoError",
			"!gotoLine",
			"!gotoSymbol",
			"!hover",
			"!iPadShowKeyboard",
			"!inPlaceReplace",
			"!linesOperations",
			"!links",
			"!multicursor",
			"!parameterHints",
			"!rename",
			"!smartSelect",
			"!suggest",
			"!toggleHighContrast",
			"!toggleTabFocusMode",
			"!transpose",
			"!wordHighlighter",
			"!wordOperations",
			"!wordPartOperations",
			*/
		] }),
		new CopyPlugin({
			patterns: [
				{ from: './index.html', to: '' },
				{ from: './images/basbolt.img', to: '' },
				{ from: './images/seabios.bin', to: '' },
				{ from: './images/vgabios.bin', to: '' },
				{ from: './services/libv86.js', to: '' }

			]
		}),
		new HtmlWebpackPlugin({
			template: './index.html'
		})
	]
};