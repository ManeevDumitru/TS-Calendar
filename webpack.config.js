const path = require('path');

module.exports = {
  entry: {
    index: './src/index.ts',
    another: './src/another.ts'
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        include: [path.resolve(__dirname, 'src')],
        use: 'ts-loader',
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  devtool: 'eval-source-map',
  output: {
    publicPath: 'public',
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'public'),
  },
};