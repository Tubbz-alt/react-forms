const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const resolve = require('path').resolve;
const merge = require('webpack-merge');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const commonConfig = {
  resolve: {
    alias: {
      'docs/components': path.resolve(__dirname, './../src/docs-components'),
    },
  },
  node: {
    fs: 'empty',
  },
  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
      },
    }, {
      test: /\.(sa|sc|c)ss$/,
      use: [ 'style-loader', 'css-loader', 'sass-loader', 'resolve-url-loader' ],
    }, {
      test: /\.(png|jpg|gif|svg|woff|ttf|eot)/,
      loader: 'url-loader',
    }, {
      test: /\.mdx?$/,
      use: [
        'babel-loader',
        '@mdx-js/loader',
      ],
    },
    ],
  },
};

const htmlPlugin = new HtmlWebPackPlugin({
  template: './demo/index.html',
  filename: './index.html',
});

const devConfig = {
  mode: 'development',
  entry: './demo/index.js',
  output: {
    publicPath: '/',
    path: resolve('../dist'),
    filename: '[name].[hash].js',
  },
  devServer: {
    historyApiFallback: true,
    contentBase: resolve('public'),
    publicPath: '/',
  },
  devtool: 'source-map',
  plugins: [ htmlPlugin ],
};

const demoTemplates = [ './index.html', './200.html', './404.html' ];
const templatePlugins =  demoTemplates.map(function(templateName) {
  return new HtmlWebPackPlugin({
    hash: false,
    filename: templateName,
    template: './demo/index.ejs',
  });
});

const prodConfig = {
  mode: 'production',
  entry: './demo/index.js',
  optimization: {
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        terserOptions: {
          keep_classnames: true,
          keep_fnames: true,
        },
      }),
    ],
  },
  output: {
    path: resolve('./public'),
    filename: 'index.[contenthash].js',
    chunkFilename: '[name].chunk.[contenthash].js',
    publicPath: '/',
  },
  plugins: [].concat(templatePlugins),
};

const vendorConfig = {
  mode: 'production',
  entry: './src/vendor.js',
  output: {
    path: resolve('./public'),
    filename: 'vendor.js',
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [ MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader', 'resolve-url-loader' ],
      },  {
        test: /\.(png|jpg|gif|svg|woff|ttf|eot)/,
        loader: 'url-loader',
      },
    ],
  },
  plugins: [ new MiniCssExtractPlugin({ filename: 'vendor.css' }) ],
};

const pf4vendorConfig = {
  mode: 'production',
  entry: './src/vendor4.js',
  output: {
    path: resolve('./public'),
    filename: 'vendor4.js',
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [ MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader', 'resolve-url-loader' ],
      },  {
        test: /\.(png|jpg|gif|svg|woff|ttf|eot)/,
        loader: 'url-loader',
      },
    ],
  },
  plugins: [ new MiniCssExtractPlugin({ filename: 'vendor4.css' }) ],
};

module.exports = env => ({
  dev: merge(commonConfig, devConfig),
  prod: merge(commonConfig, prodConfig),
  vendor: vendorConfig,
  vendor4: pf4vendorConfig,
})[env];

