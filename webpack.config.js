const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  entry: './src/index.js', // 入口
  output: {
    filename: 'finale.js',
    path: path.resolve(__dirname, '/dist'),
  },
  devtool: 'source-map',
  resolve: {
    // modules 项的配置，用于设置模块依赖查找位置。除了 node_modules 再设一个 source
    modules: ['source', 'node_modules']
  },
  plugins: [
    new HtmlWebpackPlugin({template: path.resolve(__dirname, 'src/index.html')})
  ],
}

