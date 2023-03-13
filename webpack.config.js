const path = require("path");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const currentTask = process.env.npm_lifecycle_event;

const PostCSSPlugins = [
    require('postcss-import'),
    require('autoprefixer'),
    require('postcss-mixins'),
    require('postcss-nested'),
    require('postcss-simple-vars')
];

module.exports = {
    mode: "development",
    entry: {
        app: './app/scripts/App.js'
    },
    output: {
        path: path.resolve(__dirname, 'docs'),
        filename: '[name].[contenthash].js',
        chunkFilename: '[name].[contenthash].js',
        clean: true
    },
    plugins: [
        new MiniCssExtractPlugin({filename: 'styles.[contenthash].css'}),
        new HtmlWebpackPlugin({filename: 'index.html', template: './app/index.html'}),
    ],
    devServer: {
        watchFiles: ["./app/**/*.html"],
        static: {
            directory: path.resolve(__dirname, 'docs')
        },
        hot: true,
        port: 3000
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
            minSize: 1000
        },
        minimize: true,
        minimizer: [`...`, new CssMinimizerPlugin()]
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [
                    currentTask == "build" ? MiniCssExtractPlugin.loader : 'style-loader',
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: PostCSSPlugins
                            }
                        }
                    }
                ]
            }
        ]
    }
}