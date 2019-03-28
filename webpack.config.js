const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const SpritesmithPlugin = require('webpack-spritesmith');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const fs = require('fs');

const entries = ['./app/assets/scss/index.scss', './app/index.js']

function generateHtmlPlugins(templateDir) {
  const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir));
  return templateFiles.map(item => {
    const parts = item.split('.');
    const name = parts[0];
    const extension = parts[1];
    return new HtmlWebpackPlugin({
      filename: `${name}.html`,
      template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`),
      inject: true,
    })
  })
}

const htmlPlugins = generateHtmlPlugins('./app/views')

module.exports = {
  devtool: 'source-map',
  entry: {
    styles: entries
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    library: 'jQuery'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loaders: ['babel-loader']
      },
      {
        test: /\.svg$/,
        loader: 'url-loader',
        options: {
          mimetype: 'image/svg+xml',
          limit: 8192,
        }
      },
      {
        test: /\.png$/,
        loader: 'url-loader',
        options: {
          mimetype: 'image/png',
          limit: 8192,
        }
      },
      {
        test: /\.jpeg$/,
        loader: 'url-loader',
        options: {
          mimetype: 'image/jpeg',
          limit: 8192,
        }
      },
      {
        test: /\.(woff|woff2)$/,
        loader: 'url-loader',
        options: {
          mimetype: 'application/font-woff',
          limit: 300000
        }
      },
      {
        test: /\.eot$/,
        loader: 'url-loader',
        options: {
          mimetype: 'application/vnd.ms-fontobject',
          limit: 300000
        }
      },
      {
        test: /\.(ttf|otf)$/,
        loader: 'url-loader',
        options: {
          mimetype: 'application/octet-stream',
          limit: 300000
        }
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract(
          {
            fallback: "style-loader",
            use: "css-loader?sourceMap!postcss-loader?sourceMap!resolve-url-loader!sass-loader?sourceMap",
          }),
      },

    ]
  },
  resolve: {
    modules: ["node_modules", "spritesmith-generated"]
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jquery: "jquery",
      "window.jQuery": "jquery",
      jQuery: "jquery"
    }),
    new ExtractTextPlugin({ filename: "./index.css", allChunks: true }),
    new BrowserSyncPlugin({
      host: 'localhost',
      port: 3000,
      server: { baseDir: ['dist'] }
    }),
    new FriendlyErrorsWebpackPlugin({
      clearConsole: true
    }),
    new SpritesmithPlugin({
      src: {
        cwd: path.resolve(__dirname, 'app/assets/images/sprite'),
        glob: '*.png'
      },
      target: {
        image: path.resolve(__dirname, 'app/assets/images/spritesmith-generated/sprite.png'),
        css: path.resolve(__dirname, 'app/assets/images/spritesmith-generated/sprite.scss')
      },
      apiOptions: {
        cssImageRef: "~sprite.png"
      }
    }),
  ].concat(htmlPlugins)
}