const common = require('./webpack.config.common.js');
const { merge } = require('webpack-merge');

module.exports = merge(common, {
    mode: 'development'
});