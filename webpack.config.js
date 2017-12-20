var webpack = require('webpack'),
    path = require('path'),
    ExtractTextPlugin = require("extract-text-webpack-plugin"),
    BrowserSyncPlugin = require('browser-sync-webpack-plugin'),
    FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin'),
    SpritesmithPlugin = require('webpack-spritesmith');

var testFolder = path.join(__dirname, '/public');
var fs = require('fs');
var files = fs.readdirSync(testFolder).filter(function (file) {
    return (/\.(html)$/i).test(file);
}).map(function (file) {
    return './public/' + file;
});

var entries = ['./app/scss/index.scss', './app/index.js'].concat(files);

module.exports = {
    devtool: 'source-map',
    entry: {
        styles: entries
    },
    output: {
        path: path.join(__dirname, '/public/bundle'),
        filename: 'bundle.js',
        publicPath: '../bundle/',
        library: 'jQuery'
    },
    module: {
        loaders: [
            { test: /\.html$/, loader: 'raw-loader' },
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
                    limit: 30000
                }
            },
            {
                test: /\.png$/,
                loader: 'url-loader',
                options: {
                    mimetype: 'image/png',
                    limit: 30000
                }
            },
            {
                test: /\.jpeg$/,
                loader: 'url-loader',
                options: {
                    mimetype: 'image/jpeg',
                    limit: 30000
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
                        use: "css-loader?sourceMap!postcss-loader?sourceMap!resolve-url-loader!sass-loader?sourceMap"
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
            jQuery:"jquery"
        }),
        new ExtractTextPlugin({filename: "../css/index.css", allChunks: true}),
        new BrowserSyncPlugin({
            host: 'localhost',
            port: 3000,
            server: { baseDir: ['public'] }
        }),
        new FriendlyErrorsWebpackPlugin({
            clearConsole: true
        }),
        new SpritesmithPlugin({
            src: {
                cwd: path.resolve(__dirname, 'app/icons'),
                glob: '*.png'
            },
            target: {
                image: path.resolve(__dirname, 'app/spritesmith-generated/sprite.png'),
                css: path.resolve(__dirname, 'app/spritesmith-generated/sprite.scss')
            },
            apiOptions: {
                cssImageRef: "~sprite.png"
            }
        })
    ]
}