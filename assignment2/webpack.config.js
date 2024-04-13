const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: './src/index.js', // 项目的入口文件
  output: {
    path: path.resolve(__dirname, 'public'), // 打包后的文件存放路径
    filename: 'bundle.js' // 打包后的文件名
  },
  module: {
   rules: [
     {
       test: /\.css$/,
       use: ['style-loader', 'css-loader'] // 处理CSS文件
     },
     {
       test: /\.js$/,
       exclude: /node_modules/,
       use: {
         loader: 'babel-loader', // 使用Babel转译ES6等
         options: {
           presets: ['@babel/preset-env']
         }
       }
     }
   ]
 },
 devServer: {
  hot: true,
 },
 plugins: [
   new HtmlWebpackPlugin({
     template: './src/index.html' // HTML模板文件路径
   }),
   new CopyPlugin({
    patterns: [
      { from: 'src/assets', to: 'assets' },
    ]
   })
 ],
}
